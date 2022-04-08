import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger'

const config = require('config');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(`api/${config.get('API_VERSION')}`);

  const options = new DocumentBuilder()
    .setTitle('REPL Group - Recipe App API')
    .setDescription('An API Project for the REPL group recruitment process.')
    .setVersion(`${config.get('API_VERSION')}`)
    .addTag('MealDB')
    .addTag('NestJS')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
