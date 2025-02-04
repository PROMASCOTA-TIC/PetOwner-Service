import { Type } from "class-transformer";
import { ArrayMinSize, arrayMinSize, IsArray, IsBoolean, IsNumber, IsOptional, IsPositive, IsUUID, Length, ValidateNested } from "class-validator";
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

    @IsOptional()
    @Length(10, 10)
    petOwnerPhone?: string;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[]
}