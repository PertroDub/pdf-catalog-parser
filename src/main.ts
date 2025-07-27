import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import CONFIG from '@config';
import { ExceptionsFilter, SwaggerInit } from '@core';

const { PORT, CORS_ALLOWED_ORIGINS } = CONFIG.APP;
const { NODE_ENV } = CONFIG;
const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  app.setGlobalPrefix('api');
  app.enableCors({ origin: CORS_ALLOWED_ORIGINS });
  app.useGlobalFilters(new ExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  SwaggerInit(app);

  await app.listen(PORT, () => {
    logger.log(`🚀 Server is running on: http://localhost:${PORT}`);
    logger.log(`📖 Swagger documentation: http://localhost:${PORT}/api`);
    logger.log(`🌍 Environment: ${NODE_ENV}`);
    logger.log(`🎯 API Prefix: /api`);
  });
}
bootstrap();
