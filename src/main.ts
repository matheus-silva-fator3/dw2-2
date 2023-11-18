import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import * as compression from 'compression';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: false,
    logger: ['verbose'],
  });

  // Safety middlewares.
  app.use(helmet());

  // Compressing responses for lower bandwidth.
  app.use(compression());

  const config = new DocumentBuilder()
    .setTitle('deuQuadra')
    .setDescription('A api oficial do site deu quadra.')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
