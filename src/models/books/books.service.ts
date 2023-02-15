import {Injectable} from '@nestjs/common';
import {Book} from './book';
import {CreateBookDto} from "./dto/create-book.dto";

@Injectable()
export class BooksService {
    save(createBookDto: CreateBookDto): Book {
        console.log(createBookDto);
        return null;
    }
}
