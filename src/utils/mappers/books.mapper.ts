import {Book} from "../../models/books/book";
import {BookEntity} from "../../models/books/entities/book.entity";

export class BooksMapper {
    static toModel(bookEntity: BookEntity): Book {
        return new Book(
            bookEntity.id,
            bookEntity.bookInformation.title,
            bookEntity.bookInformation.author,
            bookEntity.bookInformation.publisher,
            bookEntity.bookInformation.price,
            bookEntity.status,
            bookEntity.comment,
            bookEntity.bookInformation.lateFeePerDay
        );
    }
}