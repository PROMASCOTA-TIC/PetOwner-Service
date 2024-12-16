import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUrl, IsUUID, MaxLength, Min, MinLength } from "class-validator";

export class CreateShoppingCartItemDto {

    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @IsUUID()
    @IsNotEmpty()
    itemId: string;

    // @IsString()
    @IsUrl()
    @IsNotEmpty()
    itemUrl: string;

    @IsString()
    @MinLength(4)
    itemName: string;

    @IsString()
    @MinLength(4)
    @MaxLength(255)
    itemDescription: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    @Min(0)
    @Type(() => Number)
    itemPrice: number;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    // @Min(1)
    @Type(() => Number)
    quantity?: number;
    
    @IsDate()
    @IsOptional()
    validUntil: Date;
}
