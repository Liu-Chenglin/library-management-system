import {Module} from '@nestjs/common';
import {BooksModule} from './models/books/books.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {BookEntity} from "./models/books/entities/book.entity";
import {BookInformationEntity} from "./models/books/entities/book-information.entity";
import {StudentEntity} from "./models/students/entities/student.entity";
import {StudentTypeEntity} from "./models/students/entities/student-type.entity";
import {StudentsModule} from "./models/students/students.module";
import {BookBorrowingEntity} from "./services/book-borrowing/entities/book-borrowing.entity";
import {BookBorrowingModule} from "./services/book-borrowing/book-borrowing.module";

@Module({
    imports: [BooksModule, StudentsModule, BookBorrowingModule, TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 15432,
        username: 'postgres',
        password: 'postgres',
        database: 'library_management_system',
        entities: [BookEntity, BookInformationEntity, StudentEntity, StudentTypeEntity, BookBorrowingEntity],
        synchronize: true,
    }),],
    controllers: [],
    providers: [],
})
export class AppModule {
}
