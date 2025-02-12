import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller()
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @MessagePattern('create_address')
  create(@Payload() createAddressDto: CreateAddressDto) {
    return this.addressesService.create(createAddressDto);
  }

  @MessagePattern('find_all_addresses')
  findAll() {
    return this.addressesService.findAll();
  }

  @MessagePattern('find_one_address')
  findOne(@Payload() id: string) {
    return this.addressesService.findOne(id);
  }

  @MessagePattern('update_address')
  update(@Payload() updateAddressDto: UpdateAddressDto) {
    return this.addressesService.update(updateAddressDto.id, updateAddressDto);
  }

  @MessagePattern('remove_address')
  remove(@Payload() id: string) {
    return this.addressesService.remove(id);
  }
}
