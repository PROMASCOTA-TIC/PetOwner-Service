import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateShoppingCartItemDto } from './dto/create-shopping-cart.dto';
import { UpdateShoppingCartItemDto } from './dto/update-shopping-cart.dto';
import { ShoppingCartItem } from './models/shopping-cart-item.model';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Op } from 'sequelize';
import { RpcException } from '@nestjs/microservices';
import { v4 as UuidV4 } from 'uuid';
import { DeleteShoppingCartItemDto } from './dto/delete-shopping-cart.dto';
import { ShoppingCartConfiguration } from './models/config-shopping-cart.model';
import { envs } from '../../config';

@Injectable()
export class ShoppingCartItemService implements OnModuleInit {
  constructor(
    @InjectModel(ShoppingCartItem)
    private shoppingCartItem: typeof ShoppingCartItem,

    @InjectModel(ShoppingCartConfiguration)
    private configModel: typeof ShoppingCartConfiguration,
  ) { }

  private readonly logger = new Logger('ShoppingCartService');

  async onModuleInit() {
    this.logger.log('Initializing database connection...');
    try {
      await this.shoppingCartItem.sequelize.authenticate();
      this.logger.log('Connection to the database has been established successfully.');
    } catch (error) {
      this.logger.error('Unable to connect to the database:', error.message);
    }
  }

  // Cron job que corre cada doce horas para limpiar los ítems expirados del carro de compras
  @Cron(CronExpression.EVERY_12_HOURS)
  async cleanExpiredItems() {
    this.logger.log('Ejecutando limpieza de ítems expirados del carro de  compras...');
    const result = await this.shoppingCartItem.destroy({
      where: {
        validUntil: { [Op.lt]: new Date() },
      },
    });

    this.logger.log(`${result} ítems eliminados.`);
  }

  async findOneItemByUser(userId: string, itemId: string): Promise<ShoppingCartItem> {
    return await this.shoppingCartItem.findOne({
      where: {
        userId,
        itemId,
      },
    });
  }

  async findOneItemByUuid(userId: string, cartItemUUID: string): Promise<ShoppingCartItem> {
    return await this.shoppingCartItem.findOne({
      where: {
        userId,
        cartItemUUID,
      },
    });
  }

  async create(createDto: CreateShoppingCartItemDto) {
    const itemExists = await this.findOneItemByUser(createDto.userId, createDto.itemId);

    if (itemExists) {
      const data: UpdateShoppingCartItemDto = {
        userId: createDto.userId,
        quantity: itemExists.quantity + 1,
      };

      const respCreateExistingItem = this.update(itemExists.cartItemUUID, data, true);

      return respCreateExistingItem;
    } else {
      // TODO: Validar que el usuario y el producto existan

      // Consultar el límite máximo desde la base de datos
      const maxCartItemsConfig = await this.configModel.findOne({
        where: { configKey: 'MAX_CART_ITEMS' },
      });

      const maxCartItems = parseInt(maxCartItemsConfig?.configValue || envs.maxCartItems, 10);

      const userItems = await this.findAllByUser(createDto.userId);

      if (userItems.length >= maxCartItems) {
        throw new RpcException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'No se pueden agregar más ítems al carro de compras',
        })
      } else {
        const item = new this.shoppingCartItem({
          cartItemUUID: UuidV4(),
          ...createDto
        });

        await item.save();

        return { message: 'Item agregado al carro de compras' };
      }
    }
  }

  async findAllByUser(userId: string): Promise<ShoppingCartItem[]> {
    return this.shoppingCartItem.findAll({ where: { userId } });
  }

  async update(id: string, updateDto: UpdateShoppingCartItemDto, flag?: boolean): Promise<any> {
    const item = await this.findOneItemByUuid(updateDto.userId, id);

    if (!item) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Item with ID ${id} not found.`,
      });
    }

    await item.update({ quantity: updateDto.quantity });

    return { message: flag ? 'Item agregado al carro de compras' : 'Operación procesada exitosamente' }
  }

  async remove(id: string, deleteDto: DeleteShoppingCartItemDto): Promise<Object> {
    const item = await this.findOneItemByUuid(deleteDto.userId, id);

    if (!item) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Item with ID ${id} not found.`,
      });
    }

    await item.destroy();

    return { message: 'Item eliminado del carro de compras.' }
  }
}
