import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    Query,
    UseFilters,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {Book} from './book';
import {BooksService} from './books.service';
import {CreateBookDto} from "./dto/create-book.dto";
import {HttpExceptionFilter} from "../../common/exceptions/handlers/http-exception.filter";
import {UpdateBookDto} from "./dto/update-book.dto";
import {BookInformation} from "./book-information";

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
    async updateBook(@Param('id') bookId: number, @Body() updateBookDto: UpdateBookDto) {
        return await this.booksService.update(bookId, updateBookDto);
    }


    @Get()
    async getBooks(
        @Query('title') title?: string,
        @Query('author') author?: string,
        @Query('publisher') publisher?: string,
    ): Promise<BookInformation[]> {
        return await this.booksService.find(title, author, publisher);
    }
}
