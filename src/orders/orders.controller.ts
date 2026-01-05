import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOrderDto: CreateOrderDto) {
    const order = await this.ordersService.create(createOrderDto);
    return {
      success: true,
      message: 'Commande créée avec succès',
      data: order,
    };
  }

  @Get()
  async findAll() {
    const orders = await this.ordersService.findAll();
    return {
      success: true,
      count: orders.length,
      data: orders,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const order = await this.ordersService.findOne(id);
      return {
        success: true,
        data: order,
      };
    } catch (error) {
      throw new NotFoundException(`Commande avec l'ID ${id} non trouvée`);
    }
  }
}

