import {HttpStatus, INestApplication} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../../app.module";
import {BookBorrowingController} from "./book-borrowing.controller";
import {BookBorrowingService} from "./book-borrowing.service";
import * as request from "supertest";

describe('Book Borrowing Controller', () => {
    let bookBorrowingController: BookBorrowingController;
    let bookBorrowingService: BookBorrowingService;
    let app: INestApplication;

    const mockBookBorrowingService = {
        borrow: jest.fn(),
        return: jest.fn()
    } as unknown as BookBorrowingService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
            controllers: [BookBorrowingController],
            providers: [{
                provide: BookBorrowingService,
                useValue: mockBookBorrowingService,
            }],
        }).compile();
        app = module.createNestApplication();
        await app.init();

        bookBorrowingController = module.get<BookBorrowingController>(BookBorrowingController);
        bookBorrowingService = module.get<BookBorrowingService>(BookBorrowingService);
    });

    describe('borrowBook', () => {
        it('should borrow the book when both book and student are valid', async () => {
            jest.spyOn(bookBorrowingService, 'borrow').mockImplementation();

            await request(app.getHttpServer())
                .post('/students/1/borrow-book?bookId=1')
                .expect(HttpStatus.OK);
        });
    });

    describe('returnBook', () => {
        it('should return the book when book is normal', async () => {
            await request(app.getHttpServer())
                .post('/books/1/return-book')
                .expect(HttpStatus.OK);
        });
    });
});