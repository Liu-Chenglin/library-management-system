import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import 'reflect-metadata';
import {HttpExceptionFilter} from "./common/exceptions/handlers/http-exception.filter";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalFilters(new HttpExceptionFilter());

    const swaggerConfig = new DocumentBuilder()
        .setTitle('Library Management System')
        .setDescription('The Library Management System API description')
        .setVersion('1.0')
        .build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, swaggerDocument);

    await app.listen(3000);
}

bootstrap();
