import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Book} from './book';
import {CreateBookDto} from "./dto/create-book.dto";
import {BookInformationEntity} from "./entities/book-information.entity";
import {BooksRepository} from "./books.repository";
import {BookInformationRepository} from "./book-information.repository";
import {BooksMapper} from "../../utils/mappers/books/books.mapper";
import {BookInformationMapper} from "../../utils/mappers/books/book-information.mapper";
import {UpdateBookDto} from "./dto/update-book.dto";
import {BookInformation} from "./book-information";

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
            bookInformation: bookInformationEntity
        });
        const savedBookEntity = await this.booksRepository.save(bookEntity);

        return BooksMapper.toModel(savedBookEntity);
    }

    async delete(bookId: number) {
        await this.findOneByIdOrThrow(bookId);

        await this.booksRepository.delete(bookId);
    }

    async update(bookId: number, updateBookDto: UpdateBookDto): Promise<Book> {
        const bookEntity = await this.findOneByIdOrThrow(bookId);

        if (updateBookDto.comment !== null) bookEntity.comment = updateBookDto.comment;
        if (updateBookDto.status !== null) bookEntity.status = updateBookDto.status;

        const updatedBookEntity = await this.booksRepository.save(bookEntity);
        return BooksMapper.toModel(updatedBookEntity);
    }

    async find(title: string, author: string, publisher: string): Promise<BookInformation[]> {
        const bookInformationEntities = await this.bookInformationRepository.findMany(title, author, publisher);

        return bookInformationEntities.map((bookInformationEntity) => BookInformationMapper.toModel(bookInformationEntity));
    }

    private async findOneByIdOrThrow(bookId: number) {
        const bookEntity = await this.booksRepository.findOneById(bookId);

        if (!bookEntity) {
            throw new HttpException('Book Not Found', HttpStatus.NOT_FOUND);
        }
        return bookEntity;
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
