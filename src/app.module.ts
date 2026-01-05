import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesModule } from './sales/sales.module';
import { CustomersModule } from './customers/customers.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { CitiesModule } from './cities/cities.module';
import { ProductsModule } from './products/products.module';
import { City } from './entities/city.entity';
import { Product } from './entities/product.entity';
import { Sale } from './entities/sale.entity';
import { Province } from './entities/province.entity';
import { Customer } from './entities/customer.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Payment } from './entities/payment.entity';
import { PaymentMethod } from './entities/payment-method.entity';

@Module({
  imports: [
    // Configuration module
    // En Docker, on ignore le fichier .env et on utilise uniquement les variables d'environnement
    // En local (sans Docker), on charge le fichier .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' || process.env.DOCKER_ENV ? undefined : '.env',
      ignoreEnvFile: !!process.env.DOCKER_ENV, // Ignorer .env si DOCKER_ENV est défini
    }),
    // TypeORM configuration for PostgreSQL (Docker local ou Supabase)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const directUrl = configService.get<string>('DIRECT_URL');
        
        // Si DIRECT_URL est défini, l'utiliser (Supabase - nécessite SSL)
        if (directUrl) {
          return {
            type: 'postgres',
            url: directUrl,
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
            synchronize: configService.get<string>('NODE_ENV') !== 'production',
            ssl: {
              rejectUnauthorized: false,
            },
            logging: ['error', 'warn', 'info', 'log', 'query', 'schema'],
            logger: 'advanced-console',
            retryAttempts: 3,
            retryDelay: 3000,
          };
        }
        
        // Configuration Docker locale (sans SSL)
        const dbHost = configService.get<string>('DB_HOST') || 'postgres';
        const dbPort = configService.get<number>('DB_PORT') || 5432;
        const dbUser = configService.get<string>('DB_USER') || 'postgres';
        const dbPassword = configService.get<string>('DB_PASSWORD') || 'postgres';
        const dbName = configService.get<string>('DB_NAME') || 'gei_bi_platform';
        
        console.log(`🔌 Connexion PostgreSQL: ${dbUser}@${dbHost}:${dbPort}/${dbName}`);
        
        return {
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
          synchronize: configService.get<string>('NODE_ENV') !== 'production',
          // Pas de SSL pour les connexions locales/Docker
          ssl: false,
          logging: ['error', 'warn', 'info', 'log', 'query', 'schema'],
          logger: 'advanced-console',
          retryAttempts: 3,
          retryDelay: 3000,
        };
      },
      inject: [ConfigService],
    }),
    SalesModule,
    CustomersModule,
    OrdersModule,
    PaymentsModule,
    PaymentMethodsModule,
    CitiesModule,
    ProductsModule,
  ],
})
export class AppModule {}

