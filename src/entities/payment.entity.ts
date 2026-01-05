import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Order } from './order.entity';
import { PaymentMethod } from './payment-method.entity';

export enum PaymentStatus {
  PENDING = 'en_attente',
  COMPLETED = 'complété',
  FAILED = 'échoué',
  REFUNDED = 'remboursé',
}

@Entity('payments')
@Index(['paymentDate'])
@Index(['status'])
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  transactionId: string; // Numéro de transaction unique

  @ManyToOne(() => Order, { eager: true })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column({ type: 'uuid' })
  @Index()
  orderId: string;

  @ManyToOne(() => PaymentMethod, { eager: true })
  @JoinColumn({ name: 'paymentMethodId' })
  paymentMethod: PaymentMethod;

  @Column({ type: 'uuid' })
  paymentMethodId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 20 })
  status: string; // en_attente, complété, échoué, remboursé

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Index()
  paymentDate: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  reference: string; // Référence de transaction (numéro de carte, Mobile Money, etc.)

  @Column({ type: 'text', nullable: true })
  notes: string; // Notes sur le paiement

  @CreateDateColumn()
  createdAt: Date;
}

