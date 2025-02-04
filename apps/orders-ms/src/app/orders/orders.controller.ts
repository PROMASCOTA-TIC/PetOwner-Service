import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @MessagePattern('create_order')
  async create(@Payload() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @MessagePattern('get_all_orders')
  async findAll() {
    return this.ordersService.findAll();
  }

  @MessagePattern('get_all_user_orders')
  async findAllByUser(@Payload('userId') userId: string) {
    return this.ordersService.findAllByUser(userId);
  }

  @MessagePattern('order_paid')
  async orderPaid(@Payload() payload: { userId: string; id: string }) {
    const { userId, id } = payload;
    return this.ordersService.updatePaymentStatus(userId, id);
  }

  @MessagePattern('get_one_user_order')
  async findOne(@Payload() payload: { userId: string; id: string }) {
    const { userId, id } = payload;
    return this.ordersService.findOneUserOrder(userId, id);
  }

  @MessagePattern('confirm_deliver_item')
  async confirmDeliverItem(@Payload() payload: { userId: string; id: string, orderItemId: string }) {
    const { userId, id, orderItemId } = payload;
    return this.ordersService.handleDeliveredItemStatus(userId, id, orderItemId);
  }
}
