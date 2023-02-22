import {Test, TestingModule} from '@nestjs/testing';
import {BooksService} from './books.service';
import {BookInformationEntity} from './entities/book-information.entity';
import {BookInformationRepository} from "./book-information.repository";
import {BooksRepository} from "./books.repository";
import {CreateBookDto} from "./dto/create-book.dto";
import {BookEntity} from "./entities/book.entity";
import {BooksMapper} from "../../utils/mappers/books.mapper";
import {HttpException} from "@nestjs/common";
import {BookInformation} from "./book-information";
import {BookInformationMapper} from "../../utils/mappers/book-information.mapper";

describe('BooksService', () => {
    let service: BooksService;
    let bookInformationRepository: BookInformationRepository;
    let booksRepository: BooksRepository;

    const mockBookRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findOneById: jest.fn(),
        delete: jest.fn()
    } as unknown as BooksRepository;

    const mockBookInformationRepository = {
        findBookInformation: jest.fn(),
        createBookInformation: jest.fn(),
        saveBookInformation: jest.fn(),
        findMany: jest.fn()
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
            const bookId = 1;
            const bookEntity: BookEntity = {
                id: bookId,
                status: "test status",
                comment: "test comment",
                bookInformation: null,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: "",
                updatedBy: "",
                deleted: false,
            };

            jest.spyOn(booksRepository, "findOneById").mockImplementation(() => Promise.resolve(bookEntity));
            jest.spyOn(booksRepository, "delete").mockImplementation();

            await service.delete(bookId);

            expect(booksRepository.findOneById).toHaveBeenCalledWith(bookId);
            expect(booksRepository.delete).toHaveBeenCalledWith(bookId);
        });

        it('should throw exception when book does not exist', async () => {
            jest.spyOn(booksRepository, "findOneById").mockImplementation(() => Promise.resolve(undefined));
            const invalidBookId = 1;

            await expect(service.delete(invalidBookId)).rejects.toThrow(HttpException);

            expect(booksRepository.findOneById).toHaveBeenCalledWith(invalidBookId);
        });
    });

    describe('update', () => {
        const bookEntity: BookEntity = {
            id: 1,
            status: "available",
            comment: "original",
            bookInformation: new BookInformationEntity(),
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: "",
            updatedBy: "",
            deleted: false,
        };

        it('should update book when given one field to update', async () => {
            const updateBookDto = {
                status: "lost",
                comment: null
            }

            jest.spyOn(booksRepository, 'findOneById').mockImplementation(() => Promise.resolve(bookEntity));

            // change original book to updated book then return
            bookEntity.status = updateBookDto.status;
            jest.spyOn(booksRepository, 'save').mockImplementation(() => Promise.resolve(bookEntity));

            const result = await service.update(1, updateBookDto);

            const expectedBook = BooksMapper.toModel(bookEntity);
            expect(result).toEqual(expectedBook);
        });

        it('should update book when given two fields to update', async () => {
            const updateBookDto = {
                status: "lost",
                comment: "new comment"
            }

            jest.spyOn(booksRepository, 'findOneById').mockImplementation(() => Promise.resolve(bookEntity));

            // change original book to updated book then return
            bookEntity.status = updateBookDto.status;
            bookEntity.comment = updateBookDto.comment;
            jest.spyOn(booksRepository, 'save').mockImplementation(() => Promise.resolve(bookEntity));

            const result = await service.update(1, updateBookDto);

            const expectedBook = BooksMapper.toModel(bookEntity);
            expect(result).toEqual(expectedBook);
        });

        it('should throw exception when book does not exist', async () => {
            const updateBookDto = {
                status: "lost",
                comment: "new comment"
            }
            const invalidBookId = 1;

            jest.spyOn(booksRepository, "findOneById").mockImplementation(() => Promise.resolve(undefined));

            await expect(service.update(invalidBookId, updateBookDto)).rejects.toThrow(HttpException);

            expect(booksRepository.findOneById).toHaveBeenCalledWith(invalidBookId);
            expect(booksRepository.save).not.toBeCalled();
        });
    });

    describe('find', () => {
        it('should return an array of matching books', async () => {
            const bookInformationEntities: BookInformationEntity[] = [
                {

                    id: 1,
                    title: 'The Lord of the Rings',
                    author: 'J.R.R. Tolkien',
                    publisher: 'Bloomsbury Publishing',
                    price: 12,
                    books: [],
                    availableInventory: null,
                    totalInventory: null,
                    lateFeePerDay: 0.5,
                    createdAt: new Date('2022-01-01'),
                    updatedAt: new Date('2022-01-01'),
                    createdBy: 'admin',
                    updatedBy: 'admin',
                    deleted: false

                },
                {

                    id: 2,
                    title: 'Harry Potter and the Philosopher\'s Stone',
                    author: 'J.K. Rowling',
                    publisher: 'Bloomsbury Publishing',
                    price: 12,
                    books: [],
                    availableInventory: null,
                    totalInventory: null,
                    lateFeePerDay: 0.5,
                    createdAt: new Date('2022-01-01'),
                    updatedAt: new Date('2022-01-01'),
                    createdBy: 'admin',
                    updatedBy: 'admin',
                    deleted: false

                },
            ];
            const expectedBookInformation: BookInformation[] = bookInformationEntities.map((bookInformationEntity) => BookInformationMapper.toModel(bookInformationEntity));
            jest.spyOn(bookInformationRepository, 'findMany').mockResolvedValue(bookInformationEntities);

            const bookInformation = await service.find(undefined, undefined, 'Bloomsbury Publishing');

            expect(bookInformation).toEqual(expectedBookInformation);
        });

        it('should return an empty array when no matching books are found', async () => {
            jest.spyOn(bookInformationRepository, 'findMany').mockResolvedValue([]);

            const bookInformation = await service.find('Java', 'Joshua Bloch', 'Addison-Wesley');

            expect(bookInformation).toEqual([]);
        });
    });
});