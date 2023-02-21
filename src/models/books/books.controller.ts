import {Body, Controller, Delete, HttpCode, Param, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import {Book} from './book';
import {BooksService} from './books.service';
import {CreateBookDto} from "./dto/create-book.dto";

@Controller('/books')
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
    async deleteBook(@Param('id') id: number) {
        this.booksService.delete(id);
    }
}
