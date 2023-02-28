import {Test} from '@nestjs/testing';


import {BookBorrowingService} from './book-borrowing.service';
import {BooksService} from "../../models/books/books.service";
import {StudentsService} from "../../models/students/students.service";
import {BookBorrowingRepository} from "./entities/book-borrowing.repository";
import {BookInformationEntity} from "../../models/books/entities/book-information.entity";
import {BookEntity} from "../../models/books/entities/book.entity";
import {StudentTypeEntity} from "../../models/students/entities/student-type.entity";
import {HttpException, HttpStatus} from "@nestjs/common";

describe('BookBorrowingService', () => {
    let booksService: BooksService;
    let studentsService: StudentsService;
    let bookBorrowingService: BookBorrowingService;
    let bookBorrowingRepository: BookBorrowingRepository;

    const mockBookBorrowingRepository = {
        create: jest.fn(),
        save: jest.fn()
    } as unknown as BookBorrowingRepository;

    const mockStudentsService = {
        findOneByIdOrThrow: jest.fn(),
        save: jest.fn()
    } as unknown as StudentsService;

    const mockBooksService = {
        findOneByIdOrThrow: jest.fn(),
        save: jest.fn()
    } as unknown as BooksService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                BookBorrowingService,
                {
                    provide: StudentsService,
                    useValue: mockStudentsService,
                },
                {
                    provide: BooksService,
                    useValue: mockBooksService,
                },
                {
                    provide: BookBorrowingRepository,
                    useValue: mockBookBorrowingRepository,
                },
            ],
        }).compile();

        booksService = module.get<BooksService>(BooksService);
        studentsService = module.get<StudentsService>(StudentsService);
        bookBorrowingService = module.get<BookBorrowingService>(BookBorrowingService);
        bookBorrowingRepository = module.get<BookBorrowingRepository>(BookBorrowingRepository);
    });

    describe('borrow', () => {
        const bookInformationEntity: BookInformationEntity = {
            id: 1,
            title: "test title",
            author: "test author",
            publisher: "test publisher",
            price: 34,
            lateFeePerDay: 0.5,
            books: null,
            totalInventory: null,
            availableInventory: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        };
        const bookEntity: BookEntity = {
            id: 1,
            status: "available",
            comment: "test comment",
            bookInformation: bookInformationEntity,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        };
        const studentTypeEntity = {
            id: 2,
            type: 'Postgraduate',
            quota: 10,
            maxLoanPeriod: 21,
            students: [],
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2022-01-01'),
        } as unknown as StudentTypeEntity;
        const studentEntity = {
            id: 1,
            name: 'Test Student',
            grade: 1,
            type: studentTypeEntity,
            availableQuota: 10,
            phone: '13912345678',
            email: 'test.student@example.com',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const borrowingRecord = {
            id: 1,
            student: studentEntity,
            book: bookEntity,
            dueDate: expect.any(Date),
            returnDate: null,
            returned: false,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
        }

        it('should borrow a book', async () => {
            jest.spyOn(booksService, 'findOneByIdOrThrow').mockResolvedValue(bookEntity);
            jest.spyOn(studentsService, 'findOneByIdOrThrow').mockResolvedValue(studentEntity);
            jest.spyOn(bookBorrowingRepository, 'create').mockImplementation(() => borrowingRecord)
            const saveSpy = jest.spyOn(bookBorrowingRepository, 'save');

            await bookBorrowingService.borrow(1, 1);

            expect(saveSpy).toBeCalledWith(expect.objectContaining({
                book: bookEntity,
                student: studentEntity,
                dueDate: expect.any(Date),
            }));
            expect(booksService.save).toBeCalledWith(expect.objectContaining({
                status: 'borrowed',
            }));
            expect(studentsService.save).toBeCalledWith(expect.objectContaining({
                availableQuota: 9,
            }));
        });

        it('should throw exception when book is not available', async () => {
            bookEntity.status = 'borrowed';
            jest.spyOn(booksService, 'findOneByIdOrThrow').mockResolvedValue(bookEntity);
            jest.spyOn(studentsService, 'findOneByIdOrThrow').mockResolvedValue(studentEntity);

            await expect(bookBorrowingService.borrow(1, 1)).rejects.toThrow(new HttpException("Book is not available", HttpStatus.BAD_REQUEST));
            bookEntity.status = 'available';
        })

        it('should throw exception when student is not available', async () => {
            studentEntity.availableQuota = 0;
            jest.spyOn(booksService, 'findOneByIdOrThrow').mockResolvedValue(bookEntity);
            jest.spyOn(studentsService, 'findOneByIdOrThrow').mockResolvedValue(studentEntity);

            await expect(bookBorrowingService.borrow(1, 1)).rejects.toThrow(new HttpException("Student don't have available quota", HttpStatus.BAD_REQUEST));
            studentEntity.availableQuota = 10;
        })
    });
});
