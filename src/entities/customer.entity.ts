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
import { Order } from './order.entity';
import { City } from './city.entity';

export enum CustomerType {
  INDIVIDUAL = 'particulier',
  BUSINESS = 'entreprise',
  CONTRACTOR = 'entrepreneur',
  GOVERNMENT = 'gouvernement',
}

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @Index()
  phone: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 50 })
  customerType: string; // particulier, entreprise, entrepreneur, gouvernement

  @Column({ type: 'varchar', length: 200, nullable: true })
  companyName: string; // Pour les entreprises

  @Column({ type: 'varchar', length: 200, nullable: true })
  address: string;

  @ManyToOne(() => City, { nullable: true })
  @JoinColumn({ name: 'cityId' })
  city: City;

  @Column({ type: 'uuid', nullable: true })
  cityId: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  taxId: string; // Numéro d'identification fiscale

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalSpent: number; // Montant total dépensé

  @Column({ type: 'int', default: 0 })
  totalOrders: number; // Nombre total de commandes

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

