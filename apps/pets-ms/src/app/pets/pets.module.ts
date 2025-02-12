import { Module } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Pet } from './models/pet.model';
import { PetType } from './models/pet-type.model';
import { Breed } from './models/breed.model';

@Module({
  imports: [SequelizeModule.forFeature([Pet, PetType, Breed])],
  controllers: [PetsController],
  providers: [PetsService],
})
export class PetsModule {}
