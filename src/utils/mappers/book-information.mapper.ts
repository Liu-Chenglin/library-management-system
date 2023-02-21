import {CreateBookDto} from "../../models/books/dto/create-book.dto";
import {BookInformationEntity} from "../../models/books/entities/book-information.entity";
import {DeepPartial} from "typeorm/common/DeepPartial";

export class BookInformationMapper {
    static toEntityForCreating(createBookDto: CreateBookDto): DeepPartial<BookInformationEntity> {
        return {
            title: createBookDto.title,
            author: createBookDto.author,
            publisher: createBookDto.publisher,
            price: createBookDto.price,
            lateFeePerDay: createBookDto.lateFeePerDay,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    }
}