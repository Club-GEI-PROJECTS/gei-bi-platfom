import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { Order } from '../entities/order.entity';
import { PaymentMethod } from '../entities/payment-method.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(PaymentMethod)
    private paymentMethodsRepository: Repository<PaymentMethod>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    // Vérifier que la commande existe
    const order = await this.ordersRepository.findOne({
      where: { id: createPaymentDto.orderId },
    });

    if (!order) {
      throw new NotFoundException(`Commande avec l'ID ${createPaymentDto.orderId} non trouvée`);
    }

    // Vérifier que la méthode de paiement existe
    const paymentMethod = await this.paymentMethodsRepository.findOne({
      where: { id: createPaymentDto.paymentMethodId },
    });

    if (!paymentMethod) {
      throw new NotFoundException(`Méthode de paiement avec l'ID ${createPaymentDto.paymentMethodId} non trouvée`);
    }

    // Générer le transaction ID
    const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // Créer le paiement
    const payment = this.paymentsRepository.create({
      transactionId,
      orderId: createPaymentDto.orderId,
      paymentMethodId: createPaymentDto.paymentMethodId,
      amount: createPaymentDto.amount,
      status: createPaymentDto.status,
      paymentDate: createPaymentDto.paymentDate ? new Date(createPaymentDto.paymentDate) : null,
      reference: createPaymentDto.reference,
      notes: createPaymentDto.notes,
    });

    return await this.paymentsRepository.save(payment);
  }

  async findAll(): Promise<Payment[]> {
    return await this.paymentsRepository.find({
      relations: ['order', 'order.customer', 'paymentMethod'],
      order: { paymentDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { id },
      relations: ['order', 'order.customer', 'paymentMethod'],
    });

    if (!payment) {
      throw new NotFoundException(`Paiement avec l'ID ${id} non trouvé`);
    }

    return payment;
  }
}

