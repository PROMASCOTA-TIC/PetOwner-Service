import { IsUUID, IsNumber, IsPositive } from "class-validator";

export class OrderItemDto {
    @IsUUID()
    itemId: string;

    @IsNumber()
    @IsPositive()
    quantity: number;

    @IsNumber()
    @IsPositive()
    price: number;

    // @IsUUID()
    // entrepreneurId: string;
}