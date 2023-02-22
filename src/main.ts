import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import 'reflect-metadata';
import {HttpExceptionFilter} from "./common/exceptions/handlers/http-exception.filter";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.listen(3000);
}

bootstrap();
