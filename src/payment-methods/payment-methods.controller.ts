import { Controller, Get, Param } from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';

@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Get()
  async findAll() {
    const paymentMethods = await this.paymentMethodsService.findAll();
    return {
      success: true,
      count: paymentMethods.length,
      data: paymentMethods,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const paymentMethod = await this.paymentMethodsService.findOne(id);
    return {
      success: true,
      data: paymentMethod,
    };
  }
}

