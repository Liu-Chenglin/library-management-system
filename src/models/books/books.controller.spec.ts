import {BooksController} from './books.controller';
import {BooksService} from './books.service';
import {CreateBookDto} from "./dto/create-book.dto";
import {Book} from "./book";
import {Test, TestingModule} from "@nestjs/testing";
import {HttpException, HttpStatus, INestApplication} from "@nestjs/common";
import {AppModule} from "../../app.module";
import * as request from 'supertest';
import {BookInformation} from "./book-information";

describe('BooksController', () => {
    let booksController: BooksController;
    let booksService: BooksService;
    let app: INestApplication;

    const mockBookService = {
        create: jest.fn(),
        delete: jest.fn(),
        update: jest.fn(),
        find: jest.fn()
    } as unknown as BooksService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
            controllers: [BooksController],
            providers: [{
                provide: BooksService,
                useValue: mockBookService,
            }],
        }).compile();
        app = module.createNestApplication();
        await app.init();

        booksController = module.get<BooksController>(BooksController);
        booksService = module.get<BooksService>(BooksService);
    });

    describe('createBook', () => {
        const validCreateBookDto: CreateBookDto = {
            title: "Nest Guide",
            author: "Martin",
            publisher: "fake publisher",
            price: 32.5,
            status: "available",
            comment: "",
            lateFeePerDay: 0.5
        };

        it('should return a book when a valid createBookDto is provided', async () => {
            const createdBook = new Book(1, "Nest Guide", "Martin", "fake publisher", 32.5, "available", "", 0.5);

            jest.spyOn(booksService, 'create').mockResolvedValue(createdBook);
            const result = await booksController.createBook(validCreateBookDto);

            expect(result).toEqual(createdBook);
        });

        it('should return Bad Request when the title of given book has wrong data type ', async () => {
            const {title, ...invalidCreateBookDto} = validCreateBookDto;
            const incorrectCreateBookDto = {title: 1, ...invalidCreateBookDto};

            const response = await request(app.getHttpServer())
                .post('/books')
                .send(incorrectCreateBookDto)
                .expect(HttpStatus.BAD_REQUEST);

            expect(response.body.message.message).toContain('title must be a string');
        });

        it('should return Bad Request when given book is missing title', async () => {
            const {title, ...invalidCreateBookDto} = validCreateBookDto;

            const response = await request(app.getHttpServer())
                .post('/books')
                .send(invalidCreateBookDto)
                .expect(HttpStatus.BAD_REQUEST);

            expect(response.body.message.message).toContain('title should not be empty');
            expect(response.body.message.message).toContain('title must be a string');
        });
    });

    describe('deleteBook', () => {
        it('should delete the book when given book exists', async () => {
            jest.spyOn(booksService, 'delete').mockImplementation();

            await request(app.getHttpServer())
                .delete('/books/1')
                .expect(HttpStatus.NO_CONTENT);
        });

        it('should return NOT FOUND when given book does not exist', async () => {
            jest.spyOn(booksService, 'delete').mockRejectedValue(new HttpException('Book Not Found', HttpStatus.NOT_FOUND));

            await expect(booksController.deleteBook(1)).rejects.toThrow(HttpException);
        });
    });

    describe('updateBook', () => {
        it('should update status of a book', async () => {
            jest.spyOn(booksService, 'update').mockImplementation();

            await request(app.getHttpServer())
                .patch('/books/1')
                .send({status: 'lost'})
                .expect(HttpStatus.OK);
        });

        it('should return NOT FOUND when given book does not exist', async () => {
            const updateBookDto = {
                status: "lost",
                comment: null
            }
            jest.spyOn(booksService, 'update').mockRejectedValue(new HttpException('Book Not Found', HttpStatus.NOT_FOUND));

            await expect(booksController.updateBook(1, updateBookDto)).rejects.toThrow(HttpException);
        });
    });

    describe('findBooks', () => {
        const bookInformation = [
            new BookInformation(1, "Book 1", "F. Scott Fitzgerald", "Publisher", 12.99, 10, 8, 0.25),
            new BookInformation(2, "To Kill a Mockingbird", "Author 2", "Publisher", 10.99, 5, 3, 0.20),
        ];
        it('should return all books', async () => {
            jest.spyOn(booksService, 'find').mockResolvedValue(bookInformation);

            const result = await booksController.getBooks();

            expect(result).toEqual(bookInformation);
            expect(booksService.find).toHaveBeenCalledWith(undefined, undefined, undefined);
        });


        it('should filter books by title', async () => {
            jest.spyOn(booksService, 'find').mockResolvedValue([bookInformation[0]]);

            expect(await booksController.getBooks('Book 1')).toEqual([bookInformation[0]]);
            expect(booksService.find).toHaveBeenCalledWith('Book 1', undefined, undefined);
        });

        it('should filter books by author', async () => {
            jest.spyOn(booksService, 'find').mockResolvedValue([bookInformation[1]]);

            expect(await booksController.getBooks(undefined, 'Author 2')).toEqual([bookInformation[1]]);
            expect(booksService.find).toHaveBeenCalledWith(undefined, 'Author 2', undefined);
        });

        it('should filter books by publisher', async () => {
            jest.spyOn(booksService, 'find').mockResolvedValue([bookInformation[0], bookInformation[1]]);

            expect(await booksController.getBooks(undefined, undefined, 'Publisher')).toEqual([bookInformation[0], bookInformation[1]]);
            expect(booksService.find).toHaveBeenCalledWith(undefined, undefined, 'Publisher');
        });
    });
});
