import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Customer } from '../entities/customer.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Vérifier que le client existe
    const customer = await this.customersRepository.findOne({
      where: { id: createOrderDto.customerId },
    });

    if (!customer) {
      throw new NotFoundException(`Client avec l'ID ${createOrderDto.customerId} non trouvé`);
    }

    // Générer le numéro de commande
    const year = new Date().getFullYear();
    const allOrders = await this.ordersRepository.find();
    const ordersThisYear = allOrders.filter(
      (o) => o.orderNumber && o.orderNumber.startsWith(`CMD-${year}-`),
    );
    const orderNumber = `CMD-${year}-${String(ordersThisYear.length + 1).padStart(6, '0')}`;

    // Créer la commande
    const order = this.ordersRepository.create({
      orderNumber,
      customerId: createOrderDto.customerId,
      deliveryCityId: createOrderDto.deliveryCityId,
      deliveryAddress: createOrderDto.deliveryAddress,
      status: createOrderDto.status,
      subtotal: createOrderDto.subtotal,
      tax: createOrderDto.tax ?? 0,
      shippingCost: createOrderDto.shippingCost ?? 0,
      totalAmount: createOrderDto.totalAmount,
      orderDate: createOrderDto.orderDate ? new Date(createOrderDto.orderDate) : new Date(),
      deliveryDate: createOrderDto.deliveryDate ? new Date(createOrderDto.deliveryDate) : null,
      completedDate: createOrderDto.completedDate ? new Date(createOrderDto.completedDate) : null,
      notes: createOrderDto.notes,
    });

    const savedOrder = await this.ordersRepository.save(order);

    // Créer les items de commande
    const orderItems = createOrderDto.items.map((item) =>
      this.orderItemsRepository.create({
        orderId: savedOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      }),
    );

    await this.orderItemsRepository.save(orderItems);

    // Retourner la commande avec les relations
    return await this.ordersRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['customer', 'deliveryCity', 'items', 'items.product', 'payments'],
    });
  }

  async findAll(): Promise<Order[]> {
    return await this.ordersRepository.find({
      relations: ['customer', 'deliveryCity', 'items', 'items.product', 'payments'],
      order: { orderDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['customer', 'deliveryCity', 'items', 'items.product', 'payments'],
    });

    if (!order) {
      throw new NotFoundException(`Commande avec l'ID ${id} non trouvée`);
    }

    return order;
  }
}

