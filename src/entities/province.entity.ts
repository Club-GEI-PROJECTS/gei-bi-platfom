import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { City } from './city.entity';

@Entity('provinces')
export class Province {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  code: string; // Code de la province (ex: "KIN", "KAT", etc.)

  @OneToMany(() => City, (city) => city.province)
  cities: City[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

