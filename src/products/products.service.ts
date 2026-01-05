import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.productsRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Product> {
    return await this.productsRepository.findOne({
      where: { id },
    });
  }
}

