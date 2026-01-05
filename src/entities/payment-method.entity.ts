import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Payment } from './payment.entity';

@Entity('payment_methods')
export class PaymentMethod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string; // Espèces, Carte bancaire, Mobile Money, Virement, Chèque

  @Column({ type: 'varchar', length: 100, nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  requiresOnline: boolean; // Si le paiement nécessite une connexion en ligne

  @OneToMany(() => Payment, (payment) => payment.paymentMethod)
  payments: Payment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

