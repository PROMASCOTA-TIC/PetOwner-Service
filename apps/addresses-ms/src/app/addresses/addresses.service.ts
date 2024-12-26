import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { RpcException } from '@nestjs/microservices';
import { Address } from './entities/address.entity';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as Uuidv4 } from 'uuid';

@Injectable()
export class AddressesService {
  constructor(
    @InjectModel(Address)
    private addressModel: typeof Address,
  ){}
  private logger = new Logger(AddressesService.name);

  async create(createAddressDto: CreateAddressDto) {
    try{
      const address = {
        id: Uuidv4(),
        ...createAddressDto
      }
      await this.addressModel.create(address);
    }catch(error){
      this.logger.error("Error creating address", error);
      throw new RpcException("Error creating address");
    }
    return "Address created successfully"; ;
  }

  async findAll() {
    return await this.addressModel.findAll().catch((error) => {
      this.logger.error("Error finding all addresses", error);
      throw new NotFoundException("Error finding all addresses");
    });
  }

  async findOne(id: string) {
    const address = await this.addressModel.findByPk(id);
    if(!address){
      this.logger.error("Address not found");
      throw new NotFoundException("Address not found");
    }
    return address;
  }

  async update(id: string, updateAddressDto: UpdateAddressDto) {
    const {id:_, ...rest } = updateAddressDto;
    await this.findOne(id);
    await this.addressModel.update(rest, {where: {id}}).catch((error) => {
      this.logger.error("Error updating address", error);
      throw new RpcException("Error updating address");
    });
    return "Address updated successfully";
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.addressModel.destroy({where: {id}}).catch((error) => {
      this.logger.error("Error deleting address", error);
      throw new RpcException("Error deleting address");
    });
    return "Address deleted successfully";
  }
}
