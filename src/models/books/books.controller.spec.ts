import {BooksController} from './books.controller';
import {BooksService} from './books.service';
import {CreateBookDto} from "./dto/create-book.dto";
import {Book} from "./book";
import {Test, TestingModule} from "@nestjs/testing";


describe('BooksController', () => {
    let booksController: BooksController;
    let booksService: BooksService;

    const mockBookService = {
        create: jest.fn()
    } as unknown as BooksService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BooksController],
            providers: [{
                provide: BooksService,
                useValue: mockBookService,
            }],
        }).compile();

        booksController = module.get<BooksController>(BooksController);
        booksService = module.get<BooksService>(BooksService);
    });

    describe('createBook', () => {
        it('should return a book when a valid createBookDto is provided', async () => {
            const createBookDto: CreateBookDto = {
                title: "Nest Guide",
                author: "Martin",
                publisher: "fake publisher",
                price: 32.5,
                status: "available",
                comment: "",
                late_fee_per_day: 0.5
            };
            const createdBook = new Book(1, "Nest Guide", "Martin", "fake publisher", 32.5, "available", "", 0.5);

            jest.spyOn(booksService, 'create').mockResolvedValue(createdBook);

            expect(await booksController.createBook(createBookDto)).toEqual(createdBook);
        });
    });
});
