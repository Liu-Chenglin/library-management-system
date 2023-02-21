import {BooksController} from './books.controller';
import {BooksService} from './books.service';
import {CreateBookDto} from "./dto/create-book.dto";
import {Book} from "./book";
import {Test, TestingModule} from "@nestjs/testing";
import {HttpStatus, INestApplication} from "@nestjs/common";
import {AppModule} from "../../app.module";
import * as request from 'supertest';

describe('BooksController', () => {
    let booksController: BooksController;
    let booksService: BooksService;
    let app: INestApplication;

    const mockBookService = {
        create: jest.fn()
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

            expect(response.body.message).toContain('title must be a string');
        });

        it('should return Bad Request when given book is missing title', async () => {
            const {title, ...invalidCreateBookDto} = validCreateBookDto;

            const response = await request(app.getHttpServer())
                .post('/books')
                .send(invalidCreateBookDto)
                .expect(HttpStatus.BAD_REQUEST);

            expect(response.body.message).toContain('title should not be empty');
            expect(response.body.message).toContain('title must be a string');
        });
    });
});
