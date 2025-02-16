import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsBoolean, IsIn, IsNumber, IsOptional, IsString, IsUUID, Length, ValidateNested } from "class-validator";
import { OrderItemDto } from "./order-item.dto";

export class CreateOrderDto {
    @IsUUID()
    userId: string;

    @IsOptional()
    @IsBoolean()
    homeDelivery?: boolean;

    @IsOptional()
    @IsUUID()
    petOwnerAddressId?: string;

    @IsOptional()
    petOwnerAddress?: string;

    @IsString()
    @IsIn(['Transfer', 'Debit Card'])
    paymentMethod: string;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[]
}