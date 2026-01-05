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
import { Sale } from './sale.entity';
import { Province } from './province.entity';

@Entity('cities')
@Index(['provinceId'])
export class City {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 20, default: 'ville' })
  type: string; // 'commune' pour Kinshasa, 'ville' pour les autres villes

  @ManyToOne(() => Province, { eager: true })
  @JoinColumn({ name: 'provinceId' })
  province: Province;

  @Column({ type: 'uuid' })
  provinceId: string;

  @OneToMany(() => Sale, (sale) => sale.city)
  sales: Sale[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

