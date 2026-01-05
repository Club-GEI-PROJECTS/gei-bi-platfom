import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Customer } from './customer.entity';
import { City } from './city.entity';
import { Payment } from './payment.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PENDING = 'en_attente',
  CONFIRMED = 'confirmée',
  PROCESSING = 'en_traitement',
  SHIPPED = 'expédiée',
  DELIVERED = 'livrée',
  CANCELLED = 'annulée',
}

@Entity('orders')
@Index(['status'])
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  orderNumber: string; // Numéro de commande unique (ex: CMD-2026-001)

  @ManyToOne(() => Customer, { eager: true })
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column({ type: 'uuid' })
  @Index()
  customerId: string;

  @ManyToOne(() => City, { eager: true })
  @JoinColumn({ name: 'deliveryCityId' })
  deliveryCity: City;

  @Column({ type: 'uuid' })
  deliveryCityId: string;

  @Column({ type: 'varchar', length: 200 })
  deliveryAddress: string;

  @Column({ type: 'varchar', length: 20 })
  status: string; // en_attente, confirmée, en_traitement, expédiée, livrée, annulée

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number; // Sous-total avant taxes

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tax: number; // Taxes (TVA, etc.)

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  shippingCost: number; // Frais de livraison

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number; // Montant total

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Index() // Index pour améliorer les performances des requêtes temporelles
  orderDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveryDate: Date; // Date de livraison prévue

  @Column({ type: 'timestamp', nullable: true })
  completedDate: Date; // Date de livraison effective

  @Column({ type: 'text', nullable: true })
  notes: string; // Notes sur la commande

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @OneToMany(() => Payment, (payment) => payment.order)
  payments: Payment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

