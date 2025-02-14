import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './models/order.model';
import { OrderItem } from './models/order-item.model';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from '../../config';

@Module({
  imports: [
    SequelizeModule.forFeature([Order, OrderItem]),
    ClientsModule.register([
      {
        name: 'INCOME_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: envs.natsServers,
        },
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
