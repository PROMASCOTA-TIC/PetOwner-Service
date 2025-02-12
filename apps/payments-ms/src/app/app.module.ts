import { Module } from '@nestjs/common';
import { PaymentsModule } from './payments/payments.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { envs } from '../config';
import { Dialect } from 'sequelize';
import { Payment } from './payments/models/payment.model';

@Module({
  imports: [
    PaymentsModule,
    SequelizeModule.forRoot({
      dialect: envs.dbDialect as Dialect,
      logging: console.log,
      username: envs.dbPaymentUsername,
      password: envs.dbPaymentPassword,
      synchronize: true,
      autoLoadModels: true,
      dialectOptions: {
        connectString: envs.connectionString,
      },
      models: [Payment],
    })
  ],
})
export class AppModule {}
