import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { PetsService } from './pets.service';
import { UpdatePetDto } from './dto/update-pet.dto';
import { CreatePetDto } from './dto/create-pet.dto';

@Controller()
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @MessagePattern('create_pet')
  create(@Payload() createPetDto: CreatePetDto) {
    return this.petsService.create(createPetDto);
  }

  @MessagePattern('find_all_pets')
  findAll() {
    return this.petsService.findAll();
  }

  @MessagePattern('find_one_pet')
  findOne(@Payload() id: string) {
    console.log(id);
    return this.petsService.findOne(id);
  }

  @MessagePattern('update_pet')
  update(@Payload() updatePetDto: UpdatePetDto) {
    return this.petsService.update(updatePetDto.id, updatePetDto);
  }

  @MessagePattern('remove_pet')
  remove(@Payload() id: string) {
    return this.petsService.remove(id);
  }
}
