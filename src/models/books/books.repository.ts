import {Repository} from "typeorm";
import {BookEntity} from "./entities/book.entity";
import {DeepPartial} from "typeorm/common/DeepPartial";
import {InjectRepository} from "@nestjs/typeorm";
import {Injectable} from "@nestjs/common";

@Injectable()
export class BooksRepository {
    constructor(@InjectRepository(BookEntity) private readonly repository: Repository<BookEntity>) {
    }

    createBook(bookEntity: DeepPartial<BookEntity>) {
        return this.repository.create(bookEntity);
    }

    async saveBook(bookEntity: BookEntity) {
        return this.repository.save(bookEntity);
    }
}