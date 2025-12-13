import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const allowedOrigins = isDevelopment 
    ? ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000', 'http://localhost:3001']
    : [process.env.FRONTEND_URL || 'https://your-frontend-url.netlify.app'];
  
  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();
