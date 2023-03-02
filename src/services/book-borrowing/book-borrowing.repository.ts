import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {BookBorrowingEntity} from "./entities/book-borrowing.entity";
import {DeepPartial} from "typeorm/common/DeepPartial";

@Injectable()
export class BookBorrowingRepository {
    constructor(@InjectRepository(BookBorrowingEntity) private readonly repository: Repository<BookBorrowingEntity>) {
    }

    create(bookBorrowingEntity: DeepPartial<BookBorrowingEntity>): BookBorrowingEntity {
        return this.repository.create(bookBorrowingEntity);
    }

    async save(bookBorrowingEntity: BookBorrowingEntity): Promise<BookBorrowingEntity> {
        return await this.repository.save(bookBorrowingEntity);
    }

    async findOneByBookId(bookId: number): Promise<BookBorrowingEntity> {
        return await this.repository.createQueryBuilder("student_borrows_book")
            .leftJoinAndSelect("student_borrows_book.student", "student")
            .where("student_borrows_book.bookId = :bookId", {bookId})
            .andWhere("result IS NULL")
            .getOne();
    }
}