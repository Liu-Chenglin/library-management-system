import {Test, TestingModule} from '@nestjs/testing';
import {BooksService} from './books.service';
import {BookInformationEntity} from './entities/book-information.entity';
import {BookInformationRepository} from "./book-information.repository";
import {BooksRepository} from "./books.repository";
import {CreateBookDto} from "./dto/create-book.dto";
import {BookEntity} from "./entities/book.entity";
import {BooksMapper} from "../../utils/mappers/books.mapper";
import {HttpException} from "@nestjs/common";

describe('BooksService', () => {
    let service: BooksService;
    let bookInformationRepository: BookInformationRepository;
    let booksRepository: BooksRepository;

    const mockBookRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        delete: jest.fn()
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
            lateFeePerDay: 0.5,
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
                lateFeePerDay: createBookDto.lateFeePerDay,
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

            jest.spyOn(booksRepository, 'create').mockImplementation(() => bookEntity);
            jest.spyOn(booksRepository, 'save').mockImplementation(() => Promise.resolve(bookEntity));

            jest.spyOn(bookInformationRepository, 'findBookInformation').mockResolvedValue(undefined);
            jest.spyOn(bookInformationRepository, 'createBookInformation').mockImplementation(() => bookInformationEntity);
            jest.spyOn(bookInformationRepository, 'saveBookInformation').mockImplementation(() => Promise.resolve(bookInformationEntity));

            const result = await service.create(createBookDto);
            const expectedBook = BooksMapper.toModel(bookEntity);

            expect(bookInformationRepository.findBookInformation)
                .toHaveBeenCalledWith(
                    createBookDto.title,
                    createBookDto.author,
                    createBookDto.publisher,
                );
            expect(bookInformationRepository.saveBookInformation).toHaveBeenCalledWith(
                bookEntity.bookInformation,
            );
            expect(booksRepository.save).toHaveBeenCalledWith(
                bookEntity,
            );
            expect(result).toEqual(expectedBook);
        });
    });

    describe('delete', () => {
        it('should delete book when book exists', async () => {
            const bookEntity: BookEntity = {
                id: 1,
                status: "test status",
                comment: "test comment",
                bookInformation: null,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: "",
                updatedBy: "",
                deleted: false,
            };

            jest.spyOn(booksRepository, "findOne").mockImplementation(() => Promise.resolve(bookEntity));
            jest.spyOn(booksRepository, "delete").mockImplementation();

            await service.delete(1);

            expect(booksRepository.findOne).toHaveBeenCalledWith({id: 1});
            expect(booksRepository.delete).toHaveBeenCalledWith(1);
        });

        it('should throw exception when book does not exist', async () => {
            jest.spyOn(booksRepository, "findOne").mockImplementation(() => Promise.resolve(undefined));
            const invalidBookId = 1;

            await expect(service.delete(invalidBookId)).rejects.toThrow(HttpException);

            expect(booksRepository.findOne).toHaveBeenCalledWith({id: invalidBookId});
        });
    });
});