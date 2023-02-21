import {Injectable} from '@nestjs/common';
import {Book} from './book';
import {CreateBookDto} from "./dto/create-book.dto";
import {BookInformationEntity} from "./entities/book-information.entity";
import {BooksRepository} from "./books.repository";
import {BookInformationRepository} from "./book-information.repository";
import {BooksMapper} from "../../utils/mappers/books.mapper";

@Injectable()
export class BooksService {
    constructor(private booksRepository: BooksRepository,
                private readonly bookInformationRepository: BookInformationRepository) {
    }

    async create(createBookDto: CreateBookDto): Promise<Book> {
        const bookInformationEntity = await this.findOrSaveBookInformationEntity(createBookDto);

        const bookEntity = this.booksRepository.createBook({
            status: createBookDto.status,
            comment: createBookDto.comment,
            createdAt: new Date(),
            updatedAt: new Date(),
            bookInformation: bookInformationEntity
        });
        const savedBookEntity = await this.booksRepository.saveBook(bookEntity);

        return BooksMapper.toModel(savedBookEntity);
    }

    private async findOrSaveBookInformationEntity(createBookDto: CreateBookDto): Promise<BookInformationEntity> {
        let bookInformationEntity = await this.bookInformationRepository
            .findBookInformation(createBookDto.title, createBookDto.author, createBookDto.publisher);

        if (!bookInformationEntity) {
            const createdBookInformation = await this.bookInformationRepository.createBookInformation({
                title: createBookDto.title,
                author: createBookDto.author,
                publisher: createBookDto.publisher,
                price: createBookDto.price,
                lateFeePerDay: createBookDto.lateFeePerDay,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            bookInformationEntity = await this.bookInformationRepository.saveBookInformation(createdBookInformation);
        }

        return bookInformationEntity;
    }
}
