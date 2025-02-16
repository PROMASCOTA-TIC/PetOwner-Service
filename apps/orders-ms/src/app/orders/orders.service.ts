import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './models/order.model';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { v4 as UuidV4 } from 'uuid';
import { envs, HttpService } from '../../config';
import { OrderItem } from './models/order-item.model';
import { Sequelize } from 'sequelize-typescript';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Op } from 'sequelize';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrdersService implements OnModuleInit {
  constructor(
    @InjectModel(Order) private orderModel: typeof Order,
    @InjectModel(OrderItem) private orderItemModel: typeof OrderItem,
    @Inject('INCOME_SERVICE') private readonly incomeClient: ClientProxy,
    private readonly sequelize: Sequelize,
  ) { }

  private readonly logger = new Logger('OrdersService');

  async onModuleInit() {
    this.logger.log('Initializing database connection...');
    try {
      await this.orderModel.sequelize.authenticate();
      this.logger.log('Connection to the database has been established successfully.');
    } catch (error) {
      this.logger.error('Unable to connect to the database:', error.message);
    }
  }

  async create(createOrderDto: CreateOrderDto) {
    if (createOrderDto.items.length === 0) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: "No se puede crear una orden sin items",
      });
    }

    const petOwner = await HttpService.get(`pet-owner/${createOrderDto.userId}`);

    if ( !petOwner.data ) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: "No se puede crear una orden para un usuario que no es dueño de mascota",
      });
    } else {
      // Begin a transaction
      const transaction = await this.sequelize.transaction();
  
      try {
        const itemIds = createOrderDto.items.map(item => item.itemId);
  
        const items = await Promise.all(
          itemIds.map(async (itemId) => {
            const { data } = await HttpService.get(`products/${itemId}`);
            return data;
          })
        );
  
        const totalPrice = createOrderDto.items.reduce((acc, orderItem) => {
          const price = items.find(item => item.id === orderItem.itemId)?.finalPrice || 0;
          return acc + parseFloat(price) * orderItem.quantity;
        }, 0);
  
        const commission = await HttpService.post(`commissions/calculate-pet-owner-commission`, { amount: totalPrice });

        let totalAmount = 0;
        if ( createOrderDto.homeDelivery ) {
          totalAmount = totalPrice + commission.data + envs.orderDeliveryCost;
        } else {
          totalAmount = totalPrice + commission.data;
        }
  
        const totalItems = createOrderDto.items.reduce((acc, orderItem) => acc + orderItem.quantity, 0);

        const petOwnerAddress = await HttpService.get(`addresses/${createOrderDto.userId}`);
        
        // Create the order into the transaction
        const order = await this.orderModel.create(
          {
            id: UuidV4(),
            userId: createOrderDto.userId,
            totalAmount: totalAmount,
            totalItems: totalItems,
            homeDelivery: createOrderDto.homeDelivery,

            petOwnerPhone: petOwner.data.phoneNumber,
            paymentMethod: createOrderDto.paymentMethod,
          },
          { transaction }
        );
  
        const orderItems = createOrderDto.items.map(orderItem => ({
          orderItemId: UuidV4(),
          orderId: order.id,
          itemId: orderItem.itemId,
          quantity: orderItem.quantity,
          price: parseFloat(items.find(item => item.id === orderItem.itemId)?.finalPrice),
          entrepreneurId: items.find(item => item.id === orderItem.itemId)?.entrepreneurId,
        }));
  
        // insert order items into the transaction
        await this.orderItemModel.bulkCreate(orderItems, { transaction });
  
        await transaction.commit();
  
        // return order;
        return {
          success: true,
          message: "La orden se ha creado exitosamente."
        };
      } catch (error) {
        await transaction.rollback();
  
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message: "Error al crear la orden",
          error: error.message,
        });
      }
    }
  }

  async findAll() {
    try {
      // Buscar todas las órdenes
      return this.orderModel.findAll({
        include: [this.orderItemModel]
      });
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        success: false,
        message: "No se lograron encontrar ordenes",
        // error: error.message,
      });
    }
  }

  async findAllByUser(userId: string) {
    try {
      // Buscar todas las órdenes de un usuario
      return this.orderModel.findAll({
        where: { userId, isActive: 1 },
        include: [this.orderItemModel]
      });
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        success: false,
        message: "No se lograron encontrar ordenes del usuario",
        // error: error.message,
      });
    }

  }

  async findOneUserOrder(id: string) {
    try {
      const order = await this.orderModel.findOne({
        where: { id: id, isActive: 1 },
        include: [this.orderItemModel]
      });

      return order;
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        success: false,
        message: "No se logro obtener la orden. Intente nuevamente.",
        // error: error.message,
      });
    }
  }

  async updatePaymentStatus(userId: string, id: string) {
    try {
      // Buscar y actualizar el estado de pago de la orden
      const order = await this.findOneUserOrder(id);
      let resp = {};

      if (!order) {
        resp = {
          success: false,
          message: 'No se encontro la orden',
        };
      }

      const { data } = await HttpService.get(`payments/${order.id}/order`);

      if (data.status === 'P') {
        resp = {
          success: false,
          message: 'La orden ya se encuentra pagada',
        };
      } else {
        if (data.status === 'A') {
          const paidAt = new Date();
          paidAt.setHours(paidAt.getHours() - 5);

          const updatedAt = new Date();
          updatedAt.setHours(updatedAt.getHours() - 5);

          await order.update({
            isPaid: true,
            status: 1,
            paidAt,
            updatedAt,
          });

          const commissionValue = await HttpService.post(`commissions/calculate-pet-owner-commission`,
            {
              amount: order.totalAmount,
            }
          );

          const income = await HttpService.post(`incomes`, {
            userId: userId,
            commissionValue: commissionValue.data,
            category: 'PetOwner',	
          });
          if(income.status === 400){
            resp = {
              success: false,
              message: "Error al crear el ingreso",
            };
            throw new RpcException({
              status: HttpStatus.BAD_REQUEST,
              success: false,
              message: "Error al crear el ingreso",
            });
          }

          order.dataValues.orderItems.map(async (item) => {
            const sale = {
              entrepreneurId: item.dataValues.entrepreneurId,
              productId: item.dataValues.itemId,
              amount: parseFloat((item.dataValues.price * item.dataValues.quantity).toString()).toFixed(2),
              salesDate: item.dataValues.createdAt.toISOString()
            }
            const response = await lastValueFrom( 
              this.incomeClient.send('create_sale_by_product', {...sale})
            ).catch((error) => {
              resp = {
                success: false,
                message: "Error al crear la venta",
              };
              console.log("error", error);
              throw new RpcException(
                {
                status: HttpStatus.BAD_REQUEST,
                success: false,
                message: "Error al crear la venta",
              });
            });
          });

          resp = {
            success: true,
            message: "El pago de la orden se ha procesado exitosamente."
          };

        }
      }

      return resp;
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        success: false,
        message: "Error al procesar el pago de la orden",
        // error: error.message
      });
    }
  }

  async handleOrderItemStatusChange(id: string, orderItemId: string) {
    try {
      const order = await this.findOneUserOrder(id);

      if (!order) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          success: false,
          message: 'No se encontro la orden',
        })
      }

      const orderItem = order.orderItems.find(item => item.orderItemId === orderItemId)

      if (!orderItem) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          success: false,
          message: 'No se encontro el item',
        })
      }

      if (order.homeDelivery) {
        if (orderItem.status === 1) {
          return { message: 'El item ya ha sido entregado', succes: false };
        } else {
          if (order.homeDelivery && order.status === 1) {
            const updatedAt = new Date();
            updatedAt.setHours(updatedAt.getHours() - 5);

            await orderItem.update({
              status: 1,
              updatedAt,
            });

            this.handleOrderStatusUpdate(id);

            return {
              success: true,
              message: "El item ha sido entregado exitosamente."
            };
          } else {
            throw new RpcException({
              status: HttpStatus.BAD_REQUEST,
              success: false,
              message: 'Accion no permitida',
            })
          }
        }

      } else {
        if (orderItem.status === 2) {
          throw new RpcException({
            status: HttpStatus.BAD_REQUEST,
            success: false,
            message: 'El item ya ha sido recogido',
          })
        }

        if (!order.homeDelivery && order.status === 1) {
          const updatedAt = new Date();
          updatedAt.setHours(updatedAt.getHours() - 5);

          await orderItem.update({
            status: 2,
            updatedAt,
          });

          this.handleOrderStatusUpdate(id);

          return {
            success: true,
            message: "El item ha sido recogido exitosamente."
          };
        } else {
          throw new RpcException({
            status: HttpStatus.BAD_REQUEST,
            success: false,
            message: 'Accion no permitida',
          })
        }
      }
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        success: false,
        message: "No se pudo hacer la entrega del item",
        // error: error.message
      });
    }
  }

  async handleOrderStatusUpdate(id: string) {
    const order = await this.findOneUserOrder(id);

    try {
      if (order) {
        const updatedAt = new Date();
        updatedAt.setHours(updatedAt.getHours() - 5);

        let message = '';

        if (order.homeDelivery) {
          if (order.orderItems.every(item => item.status === 1)) {
            await order.update({
              status: 2,
              updatedAt,
            });
            message = "La orden ha sido enviada a repartidor exitosamente.";
          }
        } else {
          if (order.orderItems.every(item => item.status === 2)) {
            await order.update({
              status: 3,
              updatedAt,
            });
            message = "La orden ha sido enviada a repartidor exitosamente.";
          }
        }

        return {
          success: true,
          message,
        };
      }
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        success: false,
        message: "Hubo un inconveniente en la solciitud, intente nuevamente.",
        // error: error.message
      });
    }
  }

  async handleOrderComplete(id: string) {
    const order = await this.findOneUserOrder(id);

    try {
      let resp = {};

      if (order) {
        if (order.status === 2 || order.status === 3) {
          const updatedAt = new Date();
          updatedAt.setHours(updatedAt.getHours() - 5);

          await order.update({
            status: 4,
            updatedAt,
          });

          resp = {
            success: true,
            message: "La orden ha sido completada exitosamente.",
          };
        } else {
          resp = {
            success: false,
            message: "La orden no se encuentra en estado para completar",
          };
        }
      } else {
        resp = {
          success: false,
          message: "No se encontro la orden",
        };
      }

      return resp;
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        success: false,
        message: "Hubo un inconveniente en la solciitud, intente nuevamente.",
        // error: error.message
      });
    }
  }

  async findOrderItemsByEntrepreneur() {
    try {
      const orders = await this.orderModel.findAll({
        where: { isActive: 1, homeDelivery: 1, status: 1, isPaid: 1 },
        include: [
          {
            model: this.orderItemModel,
            where: { status: 0 }, // Filtra los ítems en la consulta
            required: true,
          }
        ],
      });

      const groupedByEntrepreneur = {};

      orders.forEach((order) => {
        order.orderItems.forEach((item) => {
          const { entrepreneurId } = item;
          // Si el emprendedor no está en el resultado, lo agregamos
          if (!groupedByEntrepreneur[entrepreneurId]) {
            groupedByEntrepreneur[entrepreneurId] = {
              entrepreneurId,
              orders: [],
            };
          }

          // Buscamos si la orden ya está en el array de este emprendedor
          let existingOrder = groupedByEntrepreneur[entrepreneurId].orders.find(o => o.id === order.id);

          if (!existingOrder) {
            // Si la orden no existe, la agregamos
            existingOrder = {
              id: order.id,
              isActive: order.isActive,
              orderItems: [],
            };
            groupedByEntrepreneur[entrepreneurId].orders.push(existingOrder);
          }

          // Agregamos el item a la orden correspondiente
          existingOrder.orderItems.push({
            orderItemId: item.orderItemId,
            itemId: item.itemId,
            quantity: item.quantity,
            price: item.price,
            status: item.status,
          });
        });
      });

      // Convertimos el objeto final en un array
      const result = Object.values(groupedByEntrepreneur);

      const data = await Promise.all(
        result.map(async (item: any) => {
          const entrepreneur = await HttpService.get(`users/entrepreneurs/${item.entrepreneurId}`);
          const products = await Promise.all(
            item.orders.flatMap((order) =>
              order.orderItems.map(async (orderItem) => {
                const product = await HttpService.get(`products/${orderItem.itemId}`);
                return product.data.name;
              })
            )
          );
          const aux = {
            orderId: item.orders[0]?.id || null, // Tomo el primer orderId disponible
            order: {
              businessName: entrepreneur.data.businessName,
              address: `${entrepreneur.data.address.callePrincipal} & ${entrepreneur.data.address.calleSecundaria}, ${entrepreneur.data.address.numeracion}, ${entrepreneur.data.address.referencia}`,
              products,
            }
          };
          return aux;
        })
      );
      return data
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        success: false,
        message: "No se lograron encontrar items del emprendedor",
      });
    }
  }

  async findOrderItemsByPetOwner() {
    try {
      const orders = await this.orderModel.findAll({
        where: { isActive: 1, homeDelivery: 1, status: 1, isPaid: 1 },
        include: [
          {
            model: this.orderItemModel,
            where: { status: 0 }, // Filtra los ítems en la consulta
            required: true,
          }
        ],
      });
      const data = await Promise.all(
        orders.map(async (order) => {
          const petOwner = await HttpService.get(`users/pet-owner/${order.userId}`);
          const products = await Promise.all(
            order.orderItems.map(async (orderItem) => {
              const product = await HttpService.get(`products/${orderItem.itemId}`);
              return product.data.name;
            })
          );
          const aux = {
            orderId: order.id,
            order: {
              petOwnerName: petOwner.data.name,
              address: order.petOwnerAddress ? order.petOwnerAddress : "",
              products,
            }
          };
          return aux;
        })
      );
      return data;
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        success: false,
        message: "No se lograron encontrar items del dueño de mascota",
      });
    }
  }


  async findOrdersByEntrepreneur(entrepreneurId: string) {
    try {
      // Buscar todas las órdenes que tengan al menos un ítem del emprendedor
      const orders = await this.orderModel.findAll({
        attributes: { exclude: ["totalItems", "totalAmount"] },
        include: [
          {
            model: this.orderItemModel,
            where: { entrepreneurId }, // Filtra los ítems en la consulta
            required: true, // Asegura que solo se incluyan órdenes con ítems de este emprendedor
          },
        ],
      });

      return orders ? orders : { message: 'No se encontraron ordenes' };
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        success: false,
        message: "Hubo un problema al buscar las ordenes",
      });
    }
  }

  async findPaidOrdersByEntrepreneur(entrepreneurId: string) {
    try {
      // Buscar todas las órdenes que tengan al menos un ítem del emprendedor
      const orders = await this.orderModel.findAll({
        attributes: { exclude: ["totalItems", "totalAmount"] },
        include: [
          {
            model: this.orderItemModel,
            where: { entrepreneurId }, // Filtra los ítems en la consulta
            required: true, // Asegura que solo se incluyan órdenes con ítems de este emprendedor
          },
        ],
        where: {  isPaid: true }
      });

      return orders ? orders : { message: 'No se encontraron ordenes' };
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        success: false,
        message: "Hubo un problema al buscar las ordenes",
      });
    }
  }

  // METODOS DE APOYO
  isReadyToShip(order: Order) {
    // return order.isActive && order.homeDelivery && order.status === 1 && order.isPaid;
    return order.isActive && order.homeDelivery && order.status === 1;
  }

  @Cron(CronExpression.EVERY_QUARTER)
  async handleCancelOrder() {
    this.logger.log('Ejecutando cancelación de órdenes no pagadas...');

    const canceledAt = new Date();
    canceledAt.setHours(canceledAt.getHours() - 5);

    const ordersToCancel = await this.orderModel.findAll({
      where: {
        updatedAt: { [Op.lt]: new Date() },
        isPaid: false,
        status: 0,
      },
      include: [this.orderItemModel]
    });

    for (const order of ordersToCancel) {
      await this.orderItemModel.update(
        {
          status: 3,
          updatedAt: canceledAt,
        },
        { where: { orderId: order.id } }
      );

      await order.update({
        canceledAt,
        isActive: 0,
        status: 5,
      });
    }
  }

}
