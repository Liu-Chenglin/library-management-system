import {Module} from '@nestjs/common';
import {BooksModule} from './models/books/books.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {BookEntity} from "./models/books/entities/book.entity";
import {BookInformationEntity} from "./models/books/entities/book-information.entity";
import {StudentEntity} from "./models/students/entities/student.entity";
import {StudentTypeEntity} from "./models/students/entities/student-type.entity";
import {StudentsModule} from "./models/students/students.module";

@Module({
    imports: [BooksModule, StudentsModule, TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'library_management_system',
        entities: [BookEntity, BookInformationEntity, StudentEntity, StudentTypeEntity],
        synchronize: true,
    }),],
    controllers: [],
    providers: [],
})
export class AppModule {
}
