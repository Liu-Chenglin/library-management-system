import {Controller, HttpCode, Param, Post, Query, UseFilters} from "@nestjs/common";
import {HttpExceptionFilter} from "../../common/exceptions/handlers/http-exception.filter";
import {BookBorrowingService} from "./book-borrowing.service";

@Controller()
@UseFilters(new HttpExceptionFilter())
export class BookBorrowingController {

    constructor(private readonly bookBorrowingService: BookBorrowingService) {
    }

    @Post('/students/:id/borrow-book')
    @HttpCode(200)
    async borrowBook(@Param("id") studentId: number, @Query('bookId') bookId: number) {
        await this.bookBorrowingService.borrow(studentId, bookId);
    }

    @Post('/books/:id/return-book')
    @HttpCode(200)
    async returnBook(@Param("id") bookId: number) {
        await this.bookBorrowingService.return(bookId);
    }
}