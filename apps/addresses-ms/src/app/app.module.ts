import { AddressesModule } from './addresses/addresses.module';
import { Address } from './addresses/entities/address.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';
import { Dialect } from 'sequelize';
import { envs } from '../config';

@Module({
  imports: [
    AddressesModule,
    SequelizeModule.forRoot({
      dialect: envs.dbDialect as Dialect,
      logging: console.log,
      username: envs.dbAddressesUsername,
      password: envs.dbAddressesPassword,
      synchronize: true,
      autoLoadModels: true,
      dialectOptions: {
        connectString: envs.connectionString,
      },
      models: [Address],
    })
  ],
})
export class AppModule { }
console.log('envs', envs);
