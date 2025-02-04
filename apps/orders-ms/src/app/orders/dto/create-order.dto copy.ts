import { IsBoolean, IsNumber, IsOptional, IsPositive, IsUUID, Length } from "class-validator";

export class CreateOrderDto {
    @IsUUID()
    userId: string;

    @IsNumber()
    @IsPositive()
    // @Type(() => Number)
    totalItems: number;

    @IsNumber()
    @IsPositive()
    // @Type(() => Number)
    totalAmount: number;

    // @IsBoolean()
    // @IsOptional()
    // isPaid: boolean = false;

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

    // @Type(() => CreateOrderItemDto)
    // items: CreateOrderItemDto[];
}

// class CreateOrderItemDto {
//     @IsUUID()
//     productId: string;

//     @IsNumber()
//     @IsPositive()
//     @Type(() => Number)
//     @Min(1)
//     quantity: number;

//     @IsNumber()
//     @IsPositive()
//     @Type(() => Number)
//     price: number;
// }

// export { 
//     CreateOrderDto, 
//     CreateOrderItemDto 
// };