import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ShoppingCartItemService } from './shopping-cart.service';
import { CreateShoppingCartItemDto } from './dto/create-shopping-cart.dto';
import { UpdateShoppingCartItemDto } from './dto/update-shopping-cart.dto';
import { ShoppingCartItem } from './models/shopping-cart-item.model';
import { DeleteShoppingCartItemDto } from './dto/delete-shopping-cart.dto';

@Controller()
export class ShoppingCartController {
  constructor(private readonly shoppingCartItemService: ShoppingCartItemService) {}

  @MessagePattern('create_shopping_cart')
  async create(@Payload() createDto: CreateShoppingCartItemDto): Promise<any> {
    return this.shoppingCartItemService.create(createDto);
  }

  @MessagePattern('get_shopping_cart_by_user')
  async findAllByUser(@Payload('userId', ParseUUIDPipe) userId: string): Promise<ShoppingCartItem[]> {
    return this.shoppingCartItemService.findAllByUser(userId);
  }

  @MessagePattern('update_shopping_cart_item')
  // async update(@Payload( 'id', ParseUUIDPipe ) data: { id: string; updateDto: UpdateShoppingCartItemDto }): Promise<ShoppingCartItem> {
  async update(@Payload() data: { id: string; updateDto: UpdateShoppingCartItemDto }): Promise<ShoppingCartItem> {
    const { id, updateDto } = data;
    console.log('id:', id);
    console.log('updateDto:', updateDto);
    return this.shoppingCartItemService.update(id, updateDto);
  }

  @MessagePattern('delete_shopping_cart_item')
  async remove(@Payload() data: { id: string; deleteDto: DeleteShoppingCartItemDto }): Promise<Object> {
    const { id, deleteDto } = data;
    return this.shoppingCartItemService.remove(id, deleteDto);
  }
}
