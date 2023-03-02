import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {BookBorrowingRepository} from "./book-borrowing.repository";
import {StudentsService} from "../../models/students/students.service";
import {BooksService} from "../../models/books/books.service";
import {BookStatus} from "../../common/constants/books.constant";
import {BookEntity} from "../../models/books/entities/book.entity";
import {StudentEntity} from "../../models/students/entities/student.entity";
import {DateUtil} from "../../utils/date.util";
import {BookBorrowingOperation, BookBorrowingResult} from "../../common/constants/book-borrowing.constant";
import {BookReturnResponseDto} from "./dto/book-return-response.dto";

@Injectable()
export class BookBorrowingService {

    constructor(private readonly bookBorrowingRepository: BookBorrowingRepository,
                private readonly studentsService: StudentsService,
                private readonly booksService: BooksService) {
    }

    async borrow(studentId: number, bookId: number) {
        const bookEntity = await this.booksService.findOneByIdOrThrow(bookId);
        const studentEntity = await this.studentsService.findOneByIdOrThrow(studentId);

        this.validateBorrowingOrThrow(bookEntity, studentEntity);

        await this.updateStudentAndBookStatus(BookBorrowingOperation.BORROW, bookEntity, studentEntity);
        const createdBookBorrowingEntity = this.bookBorrowingRepository.create({
            student: studentEntity,
            book: bookEntity,
            dueDate: DateUtil.getFutureDate(new Date(), studentEntity.type.maxLoanPeriod),
        });
        await this.bookBorrowingRepository.save(createdBookBorrowingEntity);
    }

    private async updateStudentAndBookStatus(operation: string, bookEntity: BookEntity, studentEntity: StudentEntity) {
        let updatedStatus: string;
        let quotaChange: number;
        switch (operation) {
            case BookBorrowingOperation.BORROW:
                updatedStatus = BookStatus.BORROWED;
                quotaChange = -1;
                break;
            case BookBorrowingOperation.RETURN:
                updatedStatus = BookStatus.AVAILABLE;
                quotaChange = +1;
                break;
        }
        bookEntity.status = updatedStatus;
        studentEntity.availableQuota += quotaChange;
        await this.booksService.save(bookEntity);
        await this.studentsService.save(studentEntity);
    }

    private validateBorrowingOrThrow(bookEntity: BookEntity, studentEntity: StudentEntity) {
        if (BookStatus.AVAILABLE !== bookEntity.status) {
            throw new HttpException("Book is not available", HttpStatus.BAD_REQUEST);
        }
        if (studentEntity.availableQuota <= 0) {
            throw new HttpException("Student don't have available quota", HttpStatus.BAD_REQUEST);
        }
    }

    async return(bookId: number) {
        const bookEntity = await this.booksService.findOneByIdOrThrow(bookId);
        const bookBorrowingEntity = await this.bookBorrowingRepository.findOneByBookId(bookId);
        const studentEntity = await this.studentsService.findOneByIdOrThrow(bookBorrowingEntity.student.id);

        if (bookEntity.status === BookStatus.BORROWED) {
            const bookReturnResponseDto = new BookReturnResponseDto(false, 0, 0, 0);
            const numberOfDaysOverdue = DateUtil.getDayDiff(bookBorrowingEntity.dueDate, new Date());

            if (numberOfDaysOverdue > 0) {
                bookReturnResponseDto.isOverdue = true;
                bookReturnResponseDto.numberOfDaysOverdue = numberOfDaysOverdue;
                bookReturnResponseDto.lateFeePerDay = bookEntity.bookInformation.lateFeePerDay;
                bookReturnResponseDto.lateFee = numberOfDaysOverdue * bookEntity.bookInformation.lateFeePerDay;
            }

            bookBorrowingEntity.result = BookBorrowingResult.RETURNED;
            bookBorrowingEntity.returnDate = new Date();

            await this.updateStudentAndBookStatus(BookBorrowingOperation.RETURN, bookEntity, studentEntity);
            await this.bookBorrowingRepository.save(bookBorrowingEntity);
            return bookReturnResponseDto;
        } else {
            throw new HttpException("The book cannot be returned, since it is " + bookEntity.status, HttpStatus.BAD_REQUEST);
        }
    }
}