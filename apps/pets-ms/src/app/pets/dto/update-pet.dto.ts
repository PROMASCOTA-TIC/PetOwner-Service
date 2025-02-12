import { PartialType } from '@nestjs/mapped-types';
import { CreatePetDto } from './create-pet.dto';
import { IsString } from 'class-validator';

export class UpdatePetDto extends PartialType(CreatePetDto) {

  @IsString()
  id: string;
}
