import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {BookBorrowingController} from "./book-borrowing.controller";
import {BookBorrowingService} from "./book-borrowing.service";
import {BookBorrowingEntity} from "./entities/book-borrowing.entity";

@Module({
    imports: [TypeOrmModule.forFeature([BookBorrowingEntity])],
    controllers: [BookBorrowingController],
    providers: [BookBorrowingService],
})
export class BookBorrowingModule {
}