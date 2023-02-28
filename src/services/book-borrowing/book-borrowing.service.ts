import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {BookBorrowingRepository} from "./entities/book-borrowing.repository";
import {StudentsService} from "../../models/students/students.service";
import {BooksService} from "../../models/books/books.service";

@Injectable()
export class BookBorrowingService {

    constructor(private readonly bookBorrowingRepository: BookBorrowingRepository,
                private readonly studentsService: StudentsService,
                private readonly booksService: BooksService) {
    }

    async borrow(studentId: number, bookId: number) {
        const bookEntity = await this.booksService.findOneByIdOrThrow(bookId);

        if ('available' !== bookEntity.status) {
            throw new HttpException("Book is not available", HttpStatus.BAD_REQUEST);
        }

        const studentEntity = await this.studentsService.findOneByIdOrThrow(studentId);
        if (studentEntity.availableQuota <= 0) {
            throw new HttpException("Student don't have available quota", HttpStatus.BAD_REQUEST);
        }

        bookEntity.status = 'borrowed';
        await this.booksService.save(bookEntity);
        studentEntity.availableQuota -= 1;
        await this.studentsService.save(studentEntity);

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + studentEntity.type.maxLoanPeriod);

        const createdBookBorrowingEntity = this.bookBorrowingRepository.create({
            student: studentEntity,
            book: bookEntity,
            dueDate: dueDate,
        });

        await this.bookBorrowingRepository.save(createdBookBorrowingEntity);
    }
}