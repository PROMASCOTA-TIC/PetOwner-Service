import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentDto } from './create-payment.dto';
import { IsString } from 'class-validator';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {

  @IsString()
  id: string;
}
