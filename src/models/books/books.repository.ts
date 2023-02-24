import {Repository} from "typeorm";
import {BookEntity} from "./entities/book.entity";
import {DeepPartial} from "typeorm/common/DeepPartial";
import {InjectRepository} from "@nestjs/typeorm";
import {Injectable} from "@nestjs/common";

@Injectable()
export class BooksRepository {
    constructor(@InjectRepository(BookEntity) private readonly repository: Repository<BookEntity>) {
    }

    async findOneById(id: number): Promise<BookEntity | undefined> {
        return this.repository.findOne({
            where: {id}
        });
    }

    async save(bookEntity: BookEntity) {
        return this.repository.save(bookEntity);
    }

    async delete(id: number): Promise<void> {
        await this.repository.softDelete(id);
    }

    create(bookEntity: DeepPartial<BookEntity>) {
        return this.repository.create(bookEntity);
    }
}