import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '../entities/city.entity';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private citiesRepository: Repository<City>,
  ) {}

  async findAll(): Promise<City[]> {
    return await this.citiesRepository.find({
      relations: ['province'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<City> {
    return await this.citiesRepository.findOne({
      where: { id },
      relations: ['province'],
    });
  }
}

