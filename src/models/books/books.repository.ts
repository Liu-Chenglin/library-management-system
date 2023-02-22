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
        await this.repository.delete(id);
    }

    create(bookEntity: DeepPartial<BookEntity>) {
        return this.repository.create(bookEntity);
    }

    async findMany(title?: string, author?: string, publisher?: string): Promise<BookEntity[]> {
        const queryBuilder = this.repository.createQueryBuilder('book');

        if (title) {
            queryBuilder.where(`book.title = :title`, {title});
        }
        if (author) {
            queryBuilder.andWhere(`book.author = :author`, {author});
        }
        if (publisher) {
            queryBuilder.andWhere(`book.publisher = :publisher`, {publisher});
        }

        return await queryBuilder.getMany();
    }
}