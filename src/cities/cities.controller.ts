import { Controller, Get, Param } from '@nestjs/common';
import { CitiesService } from './cities.service';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  async findAll() {
    const cities = await this.citiesService.findAll();
    return {
      success: true,
      count: cities.length,
      data: cities,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const city = await this.citiesService.findOne(id);
    return {
      success: true,
      data: city,
    };
  }
}

