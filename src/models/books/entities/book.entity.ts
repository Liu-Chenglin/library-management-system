import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {BaseEntity} from "../../../common/entities/base.entity";
import {BookInformationEntity} from "./book-information.entity";

@Entity({name: 'book'})
export class BookEntity extends BaseEntity {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({default: "available"})
    status: string;

    @Column({nullable: true})
    comment: string;

    @ManyToOne(() => BookInformationEntity, bookInformation => bookInformation.books)
    bookInformation: BookInformationEntity;
}