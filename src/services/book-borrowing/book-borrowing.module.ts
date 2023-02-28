import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {BookBorrowingController} from "./book-borrowing.controller";
import {BookBorrowingService} from "./book-borrowing.service";
import {BookBorrowingEntity} from "./entities/book-borrowing.entity";
import {BookBorrowingRepository} from "./entities/book-borrowing.repository";
import {StudentsModule} from "../../models/students/students.module";
import {BooksModule} from "../../models/books/books.module";

@Module({
    imports: [BooksModule, StudentsModule, TypeOrmModule.forFeature([BookBorrowingEntity])],
    controllers: [BookBorrowingController],
    providers: [BookBorrowingService, BookBorrowingRepository]
})
export class BookBorrowingModule {
}