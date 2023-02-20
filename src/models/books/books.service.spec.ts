import {Test, TestingModule} from '@nestjs/testing';
import {BooksService} from './books.service';
import {BookInformationEntity} from './entities/book-information.entity';
import {BookInformationRepository} from "./book-information.repository";
import {BooksRepository} from "./books.repository";
import {CreateBookDto} from "./dto/create-book.dto";
import {BookEntity} from "./entities/book.entity";

describe('BooksService', () => {
    let service: BooksService;
    let bookInformationRepository: BookInformationRepository;
    let booksRepository: BooksRepository;

    const mockBookRepository = {
        createBook: jest.fn(),
        saveBook: jest.fn()
    } as unknown as BooksRepository;

    const mockBookInformationRepository = {
        findBookInformation: jest.fn(),
        createBookInformation: jest.fn(),
        saveBookInformation: jest.fn(),
    } as unknown as BookInformationRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BooksService,
                {
                    provide: BooksRepository,
                    useValue: mockBookRepository,
                },
                {
                    provide: BookInformationRepository,
                    useValue: mockBookInformationRepository,
                },
            ],
        }).compile();

        service = module.get<BooksService>(BooksService);
        booksRepository = module.get<BooksRepository>(BooksRepository);
        bookInformationRepository = module.get<BookInformationRepository>(BookInformationRepository);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });


    describe('create', () => {
        const createBookDto: CreateBookDto = {
            title: 'Test Book',
            author: 'Test Author',
            publisher: 'Test Publisher',
            price: 10.99,
            late_fee_per_day: 0.5,
            status: 'available',
            comment: 'This is a test book',
        };

        it('should create and save a new book information entity and a new book entity when the book information does not exist in the database', async () => {
            const bookInformationEntity: BookInformationEntity = {
                id: 1,
                title: createBookDto.title,
                author: createBookDto.author,
                publisher: createBookDto.publisher,
                price: createBookDto.price,
                lateFeePerDay: createBookDto.late_fee_per_day,
                books: null,
                totalInventory: null,
                availableInventory: null,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: "",
                updatedBy: "",
                deleted: false,
            };
            const bookEntity: BookEntity = {
                id: 1,
                status: createBookDto.status,
                comment: createBookDto.comment,
                bookInformation: bookInformationEntity,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: "",
                updatedBy: "",
                deleted: false,
            };
            const {id, createdBy, updatedBy, deleted, ...createdBook} = bookEntity;

            jest.spyOn(booksRepository, 'createBook').mockImplementation(() => bookEntity);
            jest.spyOn(booksRepository, 'saveBook').mockImplementation(() => Promise.resolve(bookEntity));

            jest.spyOn(bookInformationRepository, 'findBookInformation').mockResolvedValue(undefined);
            jest.spyOn(bookInformationRepository, 'createBookInformation').mockImplementation(() => bookInformationEntity);
            jest.spyOn(bookInformationRepository, 'saveBookInformation').mockImplementation(() => Promise.resolve(bookInformationEntity));

            await service.create(createBookDto);

            expect(bookInformationRepository.findBookInformation)
                .toHaveBeenCalledWith(
                    createBookDto.title,
                    createBookDto.author,
                    createBookDto.publisher,
                );
            expect(bookInformationRepository.createBookInformation)
                .toHaveBeenCalledWith({
                    title: createBookDto.title,
                    author: createBookDto.author,
                    publisher: createBookDto.publisher,
                    price: createBookDto.price,
                    lateFeePerDay: createBookDto.late_fee_per_day,
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                });
            expect(bookInformationRepository.saveBookInformation).toHaveBeenCalledWith(
                bookEntity.bookInformation,
            );

            expect(booksRepository.createBook).toHaveBeenCalledWith(
                {
                    ...createdBook,
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                }
            );
            expect(booksRepository.saveBook).toHaveBeenCalledWith(
                bookEntity,
            );
        });
    });
});