import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);
  
  console.log('\n🔧 Configuration de l\'application...');
  const directUrl = configService.get<string>('DIRECT_URL');
  console.log(`📡 DIRECT_URL: ${directUrl ? '✅ Défini' : '❌ Non défini'}`);
  if (directUrl) {
    // Masquer le mot de passe dans les logs
    const url = directUrl.replace(/:[^:@]+@/, ':****@');
    console.log(`   URL: ${url}`);
  }
  console.log(`🌍 NODE_ENV: ${configService.get<string>('NODE_ENV') || 'non défini'}`);
  console.log(`🔌 PORT: ${configService.get<number>('PORT') || 3000}\n`);
  
  console.log('✅ Application créée\n');
  
  // Enable CORS for Power BI and Python simulator
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  console.log('✅ CORS activé\n');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  console.log('✅ Validation pipe configurée\n');

  // API prefix
  app.setGlobalPrefix('api');
  console.log('✅ Préfixe API configuré: /api\n');

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log(`🚀 Serveur BI démarré sur http://localhost:${port}`);
  console.log(`📊 API disponible sur http://localhost:${port}/api`);
  console.log(`📝 Logs détaillés activés\n`);
}

bootstrap();

