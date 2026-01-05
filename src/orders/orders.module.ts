import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Customer } from '../entities/customer.entity';
import { City } from '../entities/city.entity';
import { Product } from '../entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Customer, City, Product])],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}

