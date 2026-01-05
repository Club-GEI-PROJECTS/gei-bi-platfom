import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { City } from './city.entity';
import { Product } from './product.entity';
import { Order } from './order.entity';

@Entity('sales')
@Index(['cityId']) // Index pour les requêtes géographiques
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => City, { eager: true })
  @JoinColumn({ name: 'cityId' })
  city: City;

  @Column({ type: 'uuid' })
  cityId: string;

  @Column({ type: 'varchar', length: 100 })
  pointOfSale: string;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'uuid' })
  productId: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @ManyToOne(() => Order, { nullable: true })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column({ type: 'uuid', nullable: true })
  orderId: string; // Lien vers la commande si la vente fait partie d'une commande

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Index() // Index pour améliorer les performances des requêtes temporelles
  saleDate: Date;

  @CreateDateColumn()
  createdAt: Date;
}

