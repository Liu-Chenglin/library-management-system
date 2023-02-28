import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {BaseEntity} from "../../../common/entities/base.entity";
import {BookInformationEntity} from "./book-information.entity";
import {BookStatus} from "../../../common/constants/books.constant";

@Entity({name: 'book'})
export class BookEntity extends BaseEntity {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({default: BookStatus.AVAILABLE})
    status: string;

    @Column({nullable: true})
    comment: string;

    @ManyToOne(() => BookInformationEntity, bookInformation => bookInformation.books)
    bookInformation: BookInformationEntity;
}