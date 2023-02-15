import {BooksController} from './books.controller';
import {BooksService} from './books.service';
import {Test} from '@nestjs/testing';
import {Book} from './book';
import {CreateBookDto} from "./dto/create-book.dto";


describe('BooksController', () => {
    let booksController: BooksController;
    let booksService: BooksService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [BooksController],
            providers: [BooksService],
        }).compile();

        booksService = moduleRef.get<BooksService>(BooksService);
        booksController = moduleRef.get<BooksController>(BooksController);
    });

    describe('create book', () => {
        it('should return created book when given book is valid', () => {
            const createdBook = new Book(1, "Nest Guide", "Martin", "fake publisher", 32.5, "available", "");
            const book = new CreateBookDto("Nest Guide", "Martin", "fake publisher", 32.5, "available", "");
            jest.spyOn(booksService, 'save').mockImplementation(() => createdBook);

            const result: Book = booksController.createBook(book);

            expect(result).toBe(createdBook);
        });
    });
});
