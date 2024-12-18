import { Module } from '@nestjs/common';
import { PetsModule } from './pets/pets.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { envs } from '../config';
import { Pet } from './pets/models/pet.model';
import { PetType } from './pets/models/pet-type.model';
import { Breed } from './pets/models/breed.model';
import { Dialect } from 'sequelize';

@Module({
  imports: [
    PetsModule,
    SequelizeModule.forRoot({
      dialect: envs.dbDialect as Dialect,
      logging: console.log,
      username: envs.dbPetUsername,
      password: envs.dbPetPassword,
      synchronize: true,
      autoLoadModels: true,
      dialectOptions: {
        connectString: envs.connectionString,
      },
      models: [Pet, PetType, Breed],
    })
  ],
})
export class AppModule {}
