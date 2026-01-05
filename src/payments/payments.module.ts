import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Payment } from '../entities/payment.entity';
import { Order } from '../entities/order.entity';
import { PaymentMethod } from '../entities/payment-method.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Order, PaymentMethod])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}

