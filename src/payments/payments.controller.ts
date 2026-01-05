import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    const payment = await this.paymentsService.create(createPaymentDto);
    return {
      success: true,
      message: 'Paiement créé avec succès',
      data: payment,
    };
  }

  @Get()
  async findAll() {
    const payments = await this.paymentsService.findAll();
    return {
      success: true,
      count: payments.length,
      data: payments,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const payment = await this.paymentsService.findOne(id);
      return {
        success: true,
        data: payment,
      };
    } catch (error) {
      throw new NotFoundException(`Paiement avec l'ID ${id} non trouvé`);
    }
  }
}

