import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { City } from '../entities/city.entity';
import { Province } from '../entities/province.entity';

@Module({
  imports: [TypeOrmModule.forFeature([City, Province])],
  controllers: [CitiesController],
  providers: [CitiesService],
  exports: [CitiesService],
})
export class CitiesModule {}

