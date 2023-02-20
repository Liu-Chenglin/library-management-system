import {BooksController} from './books.controller';
import {Module} from '@nestjs/common';
import {BooksService} from './books.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {BookEntity} from "./entities/book.entity";
import {BookInformationEntity} from "./entities/book-information.entity";
import {BooksRepository} from "./books.repository";
import {BookInformationRepository} from "./book-information.repository";

@Module({
    imports: [TypeOrmModule.forFeature([BookEntity, BookInformationEntity])],
    controllers: [BooksController],
    providers: [BooksService, BooksRepository, BookInformationRepository],
})
export class BooksModule {
}
