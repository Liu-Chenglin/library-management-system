import {Injectable} from '@nestjs/common';
import {Book} from './book';
import {CreateBookDto} from "./dto/create-book.dto";
import {BookInformationEntity} from "./entities/book-information.entity";
import {BooksRepository} from "./books.repository";
import {BookInformationRepository} from "./book-information.repository";
import {BooksMapper} from "../../utils/mappers/books.mapper";
import {BookInformationMapper} from "../../utils/mappers/book-information.mapper";

@Injectable()
export class BooksService {
    constructor(private readonly booksRepository: BooksRepository,
                private readonly bookInformationRepository: BookInformationRepository) {
    }

    async create(createBookDto: CreateBookDto): Promise<Book> {
        const bookInformationEntity = await this.findOrSaveBookInformationEntity(createBookDto);

        const bookEntity = this.booksRepository.create({
            status: createBookDto.status,
            comment: createBookDto.comment,
            createdAt: new Date(),
            updatedAt: new Date(),
            bookInformation: bookInformationEntity
        });
        const savedBookEntity = await this.booksRepository.save(bookEntity);

        return BooksMapper.toModel(savedBookEntity);
    }

    async delete(bookId: number) {
        const bookEntity = this.booksRepository.findOne({id: bookId});

        await this.booksRepository.delete(bookId);
    }

    private async findOrSaveBookInformationEntity(createBookDto: CreateBookDto): Promise<BookInformationEntity> {
        let bookInformationEntity = await this.bookInformationRepository
            .findBookInformation(createBookDto.title, createBookDto.author, createBookDto.publisher);

        if (!bookInformationEntity) {
            const createdBookInformation = await this.bookInformationRepository
                .createBookInformation(BookInformationMapper.toEntityForCreating(createBookDto));
            bookInformationEntity = await this.bookInformationRepository.saveBookInformation(createdBookInformation);
        }

        return bookInformationEntity;
    }
}
