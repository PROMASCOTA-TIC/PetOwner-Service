import { Type } from "class-transformer";
import { IsNumber, IsPositive, IsUUID, Min } from "class-validator";

// export class UpdateOrderDto extends PartialType(CreateOrderDto) {
export class UpdateOrderDto {
  @IsNumber()
  @IsPositive()
  totalAmount?: number;

  @Type(() => UpdateOrderItemDto )
  items?: UpdateOrderItemDto[];
}

// export class UpdateOrderItemDto extends PartialType(CreateOrderItemDto) {
export class UpdateOrderItemDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity?: number;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price?: number;
}