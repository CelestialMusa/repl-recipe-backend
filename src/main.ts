import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger'
import { ConfigService } from './modules/shared/config/config.service';
async function bootstrap() {
  let _configService = new ConfigService();

  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Expose-Headers', 'access_token, refresh_token');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, access_token, refresh_token');
    res.header('X-Powered-By', 'Blood, sweat and tears');
    next();
  });

  app.setGlobalPrefix(`api/${_configService.get('API_VERSION')}`);

  const options = new DocumentBuilder()
    .setTitle('REPL Group - Recipe App API')
    .setDescription('An API Project for the REPL group recruitment process.')
    .setVersion(`${_configService.get('API_VERSION')}`)
    .addTag('MealDB')
    .addTag('NestJS')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(_configService.getNumber('API_PORT'));
}
bootstrap();
