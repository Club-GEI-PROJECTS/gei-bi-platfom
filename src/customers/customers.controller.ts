import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    const customer = await this.customersService.create(createCustomerDto);
    return {
      success: true,
      message: 'Client créé avec succès',
      data: customer,
    };
  }

  @Get()
  async findAll() {
    const customers = await this.customersService.findAll();
    return {
      success: true,
      count: customers.length,
      data: customers,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const customer = await this.customersService.findOne(id);
      return {
        success: true,
        data: customer,
      };
    } catch (error) {
      throw new NotFoundException(`Client avec l'ID ${id} non trouvé`);
    }
  }
}

