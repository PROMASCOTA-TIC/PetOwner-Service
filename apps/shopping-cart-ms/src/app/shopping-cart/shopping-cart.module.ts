import { Module } from '@nestjs/common';
import { ShoppingCartItemService } from './shopping-cart.service';
import { ShoppingCartController } from './shopping-cart.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ShoppingCartItem } from './models/shopping-cart-item.model';
import { ShoppingCartConfiguration } from './models/config-shopping-cart.model';

@Module({
  imports: [
    SequelizeModule.forFeature([ShoppingCartItem, ShoppingCartConfiguration]),
  ],
  controllers: [ShoppingCartController],
  providers: [ShoppingCartItemService],
})
export class ShoppingCartModule {}
