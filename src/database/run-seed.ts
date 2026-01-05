import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { resolve } from 'path';
import { Province } from '../entities/province.entity';
import { City } from '../entities/city.entity';
import { Product } from '../entities/product.entity';
import { Sale } from '../entities/sale.entity';
import { Customer } from '../entities/customer.entity';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Payment } from '../entities/payment.entity';
import { PaymentMethod } from '../entities/payment-method.entity';
import { seedDatabase } from './seed';

// Charger les variables d'environnement depuis la racine du projet
config({ path: resolve(__dirname, '../../.env') });

async function runSeed() {
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DIRECT_URL,
      entities: [
        Province,
        City,
        Product,
        Sale,
        Customer,
        Order,
        OrderItem,
        Payment,
        PaymentMethod,
      ],
    synchronize: false, // Ne pas synchroniser, on utilise le seed
    ssl: {
      rejectUnauthorized: false,
    },
    logging: true,
  });

  try {
    console.log('🔌 Connexion à la base de données...');
    await dataSource.initialize();
    console.log('✅ Connecté à la base de données\n');

    await seedDatabase(dataSource);

    await dataSource.destroy();
    console.log('\n👋 Connexion fermée');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

runSeed();

