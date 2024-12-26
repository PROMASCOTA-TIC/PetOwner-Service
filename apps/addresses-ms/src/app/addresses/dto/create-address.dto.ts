import { IsString, IsUUID } from "class-validator";

export class CreateAddressDto {

    @IsString()
    zone: string;

    @IsString()
    addressName: string;

    @IsString()
    lat: string;

    @IsString()
    lng: string;

    @IsString()
    description: string;

    @IsString()
    reference: string;

    @IsUUID()
    userId: string;
}
