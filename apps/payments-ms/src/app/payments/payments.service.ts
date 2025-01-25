import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Payment } from './models/payment.model';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment)
    private payment: typeof Payment
  ){}
  private readonly logger = new Logger(PaymentsService.name);

  async create(createPaymentDto: CreatePaymentDto) {
    try{
      const newPayment = {
        ...createPaymentDto,
      }
      console.log(newPayment);
      await this.payment.create(newPayment);
      return {message: 'Payment created successfully'};
    }catch (error){
      this.logger.error('Error creating payment:', error.message);
      throw new RpcException(error.message);
    }
  }

  async findAll() {
    return await this.payment.findAll().catch((error) => {
      this.logger.error('Error getting payments:', error.message);
      throw new NotFoundException('Error getting payments:', error.message);
    });
  }

  async findOne(id: string) {
    const payment = await this.payment.findByPk(id);
    if (!payment) {
      this.logger.error(`Payment with id ${id} not found`);
      throw new NotFoundException(`Payment with id ${id} not found`);
    }
    return payment;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    const { id:_, ...rest } = updatePaymentDto;
    await this.findOne(id);
    return await this.payment.update(rest, { where: { id } }).catch((error) => {
      this.logger.error('Error updating payment:', error.message);
      throw new RpcException(error.message);
    });
  }
  
}
