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
// En Docker, les variables sont déjà définies, on ignore le .env
if (!process.env.DOCKER_ENV) {
  config({ path: resolve(__dirname, '../../.env') });
}

async function runSeed() {
  // Détecter si on est dans Docker ou en local
  const isDocker = process.env.DOCKER_ENV === 'true' || process.env.DB_HOST === 'postgres';
  
  let dataSourceConfig: any;
  
  if (isDocker || process.env.DB_HOST) {
    // Configuration Docker (utilise les variables d'environnement Docker)
    const dbHost = process.env.DB_HOST || 'postgres';
    const dbPort = parseInt(process.env.DB_PORT || '5432', 10);
    const dbUser = process.env.DB_USER || 'postgres';
    const dbPassword = process.env.DB_PASSWORD || 'postgres';
    const dbName = process.env.DB_NAME || 'gei_bi_platform';
    
    console.log(`🔌 Configuration Docker: ${dbUser}@${dbHost}:${dbPort}/${dbName}`);
    
    dataSourceConfig = {
      type: 'postgres',
      host: dbHost,
      port: dbPort,
      username: dbUser,
      password: dbPassword,
      database: dbName,
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
      synchronize: true, // Créer les tables si elles n'existent pas
      ssl: false, // Pas de SSL pour Docker local
      logging: true,
    };
  } else if (process.env.DIRECT_URL) {
    // Configuration Supabase (DIRECT_URL)
    console.log(`🔌 Configuration Supabase: ${process.env.DIRECT_URL.replace(/:[^:@]+@/, ':****@')}`);
    
    dataSourceConfig = {
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
      synchronize: true, // Créer les tables si elles n'existent pas
      ssl: {
        rejectUnauthorized: false,
      },
      logging: true,
    };
  } else {
    // Configuration par défaut (localhost)
    console.log(`🔌 Configuration locale: postgres@localhost:5432/gei_bi_platform`);
    
    dataSourceConfig = {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'gei_bi_platform',
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
      synchronize: true, // Créer les tables si elles n'existent pas
      ssl: false,
      logging: true,
    };
  }

  const dataSource = new DataSource(dataSourceConfig);

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

