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
  async orderPaid(@Payload() payload: { userId: string; id: string, paymentComment: string }) {
    const { userId, id, paymentComment } = payload;
    return this.ordersService.updatePaymentStatus(userId, id, paymentComment);
  }

  @MessagePattern('get_one_user_order')
  async findOne(@Payload() payload: { id: string; userId?: string }) {
    const { userId, id } = payload;
    return this.ordersService.findOneUserOrder(id);
  }

  @MessagePattern('change_order_item_status')
  async changeOrderItemStatus(@Payload() payload: { id: string, orderItemId: string }) {
    const { id, orderItemId } = payload;
    return this.ordersService.handleOrderItemStatusChange(id, orderItemId);
  }

  @MessagePattern('get_items_by_entrepreneur')
  async getItemsByEntrepreneur(@Payload('entrepreneurId') entrepreneurId: string) {
    return this.ordersService.findOrderItemsByEntrepreneur(entrepreneurId);
  }

  @MessagePattern('get_orders_by_entrepreneur')
  async getOrdersByEntrepreneur(@Payload('entrepreneurId') entrepreneurId: string) {
    return this.ordersService.findOrdersByEntrepreneur(entrepreneurId);
  }

  @MessagePattern('get_paid_orders_by_entrepreneur')
  async getPaidOrdersByEntrepreneur(@Payload('entrepreneurId') entrepreneurId: string) {
    return this.ordersService.findPaidOrdersByEntrepreneur(entrepreneurId);
  }
}
