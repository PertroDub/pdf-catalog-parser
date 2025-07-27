import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import CONFIG from '@config';

export const SwaggerInit = (app: NestFastifyApplication) => {
  const { PORT } = CONFIG.APP;
  const { NODE_ENV } = CONFIG;

  const config = new DocumentBuilder()
    .setTitle('Test task for catalogs API')
    .setDescription('Test task for catalogs parsing')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(
      `http://localhost:${PORT}`,
      `${NODE_ENV.charAt(0).toUpperCase() + NODE_ENV.slice(1)} server`,
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
};
