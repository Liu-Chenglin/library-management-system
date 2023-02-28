import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {BookBorrowingRepository} from "./entities/book-borrowing.repository";
import {StudentsService} from "../../models/students/students.service";
import {BooksService} from "../../models/books/books.service";
import {BookStatus} from "../../common/constants/books.constant";
import {BookEntity} from "../../models/books/entities/book.entity";
import {StudentEntity} from "../../models/students/entities/student.entity";

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

        await this.updateStudentAndBookStatus(bookEntity, studentEntity);

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + studentEntity.type.maxLoanPeriod);

        const createdBookBorrowingEntity = this.bookBorrowingRepository.create({
            student: studentEntity,
            book: bookEntity,
            dueDate: dueDate,
        });

        await this.bookBorrowingRepository.save(createdBookBorrowingEntity);
    }

    private async updateStudentAndBookStatus(bookEntity: BookEntity, studentEntity: StudentEntity) {
        bookEntity.status = BookStatus.BORROWED;
        await this.booksService.save(bookEntity);
        studentEntity.availableQuota -= 1;
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
}