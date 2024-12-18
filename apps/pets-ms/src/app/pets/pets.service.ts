import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Pet } from './models/pet.model';
import { v4 as Uuidv4 } from 'uuid';

@Injectable()
export class PetsService {
  constructor(
    @InjectModel(Pet)
    private pet: typeof Pet,
  ){}
  private readonly logger = new Logger(PetsService.name);

  async onModuleInit() {
    try {
      await this.pet.sequelize.authenticate();
      this.logger.log('Connection to the Oracle database is successful.')
    } catch (error) {
      this.logger.error(`Failed to connect to the Oracle database: ${error.message}`)
    }
  }

  async create(createPetDto: CreatePetDto) {
    const { medicalHistory, photosUrls, ...rest } = createPetDto;
    try{
      const newPet = {
        id: Uuidv4(),
        medicalHistory: medicalHistory.join(', '),
        photosUrls: photosUrls.join(', '),
        ...rest
      }
      console.log(newPet);
      await this.pet.create(newPet);
      return { message: 'Pet created successfully' };
    } catch (error) {
      this.logger.error('Error creating pet:', error.message);
      throw new Error(error.message);
    }
  }

  async findAll() {
    return await this.pet.findAll().catch(error => {
      this.logger.error('Error getting pets:', error.message);
      throw new NotFoundException('Error getting pets:', error.message);
    });
  }

  async findOne(id: string) {
    const pet = await this.pet.findByPk(id);
    if (!pet) {
      this.logger.error(`Pet with id ${id} not found`);
      throw new NotFoundException(`Pet with id ${id} not found`);
    }
    return pet;
  }

  async update(id: string, updatePetDto: UpdatePetDto) {
    const { id:_, ...rest } = updatePetDto;
    await this.findOne(id);
    return await this.pet.update(rest, { where: { id } }).catch(error => {
      this.logger.error('Error updating pet:', error.message);
      throw new Error(error.message);
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.pet.destroy({ where: { id } }).catch(error => {
      this.logger.error('Error deleting pet:', error.message);
      throw new Error(error.message);
    });
  }
}
