import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { Customer } from '../entities/customer.entity';
import { City } from '../entities/city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, City])],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}

