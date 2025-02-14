import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('create_payment')
  create(@Payload() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @MessagePattern('find_all_payments')
  findAll() {
    return this.paymentsService.findAll();
  }

  @MessagePattern('find_one_payment')
  findOne(@Payload() id: string) {
    return this.paymentsService.findOne(id);
  }

  @MessagePattern('find_one_payment_by_order_id')
  findOneByOrderId(@Payload() orderId: string) {
    console.log('orderId', orderId);
    return this.paymentsService.findOneByOrderId(orderId);
  }

  @MessagePattern('update_payment')
  update(@Payload() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(updatePaymentDto.id, updatePaymentDto);
  }
}
