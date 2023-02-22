import {Repository} from "typeorm";
import {BookInformationEntity} from "./entities/book-information.entity";
import {DeepPartial} from "typeorm/common/DeepPartial";
import {InjectRepository} from "@nestjs/typeorm";
import {Injectable} from "@nestjs/common";

@Injectable()
export class BookInformationRepository {
    constructor(@InjectRepository(BookInformationEntity) private readonly repository: Repository<BookInformationEntity>) {
    }

    async findBookInformation(title: string, author: string, publisher: string): Promise<BookInformationEntity | undefined> {
        return await this.repository.findOne({where: {title, author, publisher}});
    }

    createBookInformation(bookInformationEntity: DeepPartial<BookInformationEntity>): BookInformationEntity {
        return this.repository.create(bookInformationEntity);
    }

    async saveBookInformation(bookInformationEntity: BookInformationEntity): Promise<BookInformationEntity> {
        return await this.repository.save(bookInformationEntity);
    }

    async findMany(title?: string, author?: string, publisher?: string): Promise<BookInformationEntity[]> {
        const queryBuilder = this.repository.createQueryBuilder('book-information');

        if (title) {
            queryBuilder.where(`title = :title`, {title});
        }
        if (author) {
            queryBuilder.andWhere(`author = :author`, {author});
        }
        if (publisher) {
            queryBuilder.andWhere(`publisher = :publisher`, {publisher});
        }

        return await queryBuilder.getMany();
    }
}