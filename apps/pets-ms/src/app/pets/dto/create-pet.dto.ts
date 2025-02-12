import { Type } from "class-transformer";
import { IsArray, IsDateString, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreatePetDto {
    
    @IsString()
    name: string;

    @IsString()
    petTypeId: string;

    @IsString()
    breedId: string;

    @IsDateString()
    birthday: Date;

    @IsString()
    gender: string;

    @IsNumber({
        maxDecimalPlaces: 2
    })
    @Min(0)
    @Type(() => Number)
    weight: number;

    @IsString()
    preferences: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    medicalHistory?: string[];

    @IsArray()
    @IsString({ each: true })
    photoUrl?: string;

    @IsString()
    ownerId: string;
}
