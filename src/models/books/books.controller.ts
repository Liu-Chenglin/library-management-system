import {Controller, Post, Request} from '@nestjs/common';
import {Book} from './book';
import {BooksService} from './books.service';
import {CreateBookDto} from "./dto/create-book.dto";

@Controller('/books')
export class BooksController {
    constructor(private readonly booksService: BooksService) {
    }

    @Post()
    createBook(@Request() createBookDto: CreateBookDto): Book {
        return this.booksService.save(createBookDto);
    }
}
