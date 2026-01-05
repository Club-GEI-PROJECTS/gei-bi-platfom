import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { Sale } from '../entities/sale.entity';
import { City } from '../entities/city.entity';
import { Product } from '../entities/product.entity';
import { Province } from '../entities/province.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, City, Product, Province])],
  controllers: [SalesController],
  providers: [SalesService],
  exports: [SalesService],
})
export class SalesModule {}

