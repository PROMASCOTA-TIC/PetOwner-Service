import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { envs } from '../config';
import { Dialect } from 'sequelize';
import { Order } from './orders/models/order.model';
import { OrderItem } from './orders/models/order-item.model';

@Module({
  imports: [
    OrdersModule,
    SequelizeModule.forRoot({
      dialect: envs.dbDialect as Dialect,
      logging: console.log,
      username: envs.dbOrderUsername,
      password: envs.dbOrderPassword,
      synchronize: true,
      autoLoadModels: true,
      timezone: '-05:00', // Ecuador timezone
      dialectOptions: {
        connectString: envs.connectionString,
      },
      models: [Order, OrderItem],
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
