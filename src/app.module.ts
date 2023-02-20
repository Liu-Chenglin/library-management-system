import {Module} from '@nestjs/common';
import {BooksModule} from './models/books/books.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {BookEntity} from "./models/books/entities/book.entity";
import {BookInformationEntity} from "./models/books/entities/book-information.entity";

@Module({
    imports: [BooksModule, TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'library_management_system',
        entities: [BookEntity, BookInformationEntity],
        synchronize: true,
    }),],
    controllers: [],
    providers: [],
})
export class AppModule {
}
