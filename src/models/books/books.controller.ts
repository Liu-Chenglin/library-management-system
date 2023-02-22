import {
    Body,
    Controller,
    Delete,
    HttpCode,
    Param,
    Patch,
    Post,
    UseFilters,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {Book} from './book';
import {BooksService} from './books.service';
import {CreateBookDto} from "./dto/create-book.dto";
import {HttpExceptionFilter} from "../../common/exceptions/handlers/http-exception.filter";
import {UpdateBookDto} from "./dto/update-book.dto";

@Controller('/books')
@UseFilters(new HttpExceptionFilter())
export class BooksController {
    constructor(private readonly booksService: BooksService) {
    }

    @Post()
    @UsePipes(new ValidationPipe())
    async createBook(@Body() createBookDto: CreateBookDto): Promise<Book> {
        return await this.booksService.create(createBookDto);
    }

    @Delete(':id')
    @HttpCode(204)
    async deleteBook(@Param('id') bookId: number) {
        await this.booksService.delete(bookId);
    }

    @Patch(':id')
    updateBook(@Body() updateBookDto: UpdateBookDto) {
        this.booksService.update(updateBookDto);
    }
}
