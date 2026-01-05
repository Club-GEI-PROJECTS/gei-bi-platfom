import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customer = this.customersRepository.create({
      ...createCustomerDto,
      isActive: createCustomerDto.isActive ?? true,
      totalSpent: 0,
      totalOrders: 0,
    });

    return await this.customersRepository.save(customer);
  }

  async findAll(): Promise<Customer[]> {
    return await this.customersRepository.find({
      relations: ['city'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customersRepository.findOne({
      where: { id },
      relations: ['city', 'orders'],
    });

    if (!customer) {
      throw new NotFoundException(`Client avec l'ID ${id} non trouvé`);
    }

    return customer;
  }
}

