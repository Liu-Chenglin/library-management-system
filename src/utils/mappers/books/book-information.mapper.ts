import {CreateBookDto} from "../../../models/books/dto/create-book.dto";
import {BookInformationEntity} from "../../../models/books/entities/book-information.entity";
import {DeepPartial} from "typeorm/common/DeepPartial";
import {BookInformation} from "../../../models/books/book-information";

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

    static toModel(bookInformationEntity: BookInformationEntity): BookInformation {
        return new BookInformation(
            bookInformationEntity.id,
            bookInformationEntity.title,
            bookInformationEntity.author,
            bookInformationEntity.publisher,
            bookInformationEntity.price,
            bookInformationEntity.totalInventory,
            bookInformationEntity.availableInventory,
            bookInformationEntity.lateFeePerDay)
    }
}