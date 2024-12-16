import { Module } from '@nestjs/common';
import { ShoppingCartModule } from './shopping-cart/shopping-cart.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ShoppingCartItem } from './shopping-cart/models/shopping-cart-item.model';
import { Dialect } from 'sequelize';
import { envs } from '../config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ShoppingCartModule,
    ScheduleModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: envs.dbDialect as Dialect,
      logging: console.log,
      username: envs.dbShoppingCartUsername,
      password: envs.dbShoppingCartPassword,
      synchronize: true,
      autoLoadModels: true,
      timezone: '-05:00', // Ecuador timezone
      dialectOptions: {
        connectString: envs.connectionString,
      },
      models: [ShoppingCartItem],
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
