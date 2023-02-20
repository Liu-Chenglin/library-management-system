import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {BaseEntity} from "../../../common/entities/base.entity";
import {BookEntity} from "./book.entity";

@Entity({name: 'book_information'})
export class BookInformationEntity extends BaseEntity {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column()
    title: string;

    @Column()
    author: string;

    @Column()
    publisher: string;

    @Column()
    price: number;

    @OneToMany(() => BookEntity, book => book.bookInformation)
    books: BookEntity[];

    @Column({type: "int", nullable: true})
    totalInventory: number;

    @Column({type: "int", nullable: true})
    availableInventory: number;

    @Column({type: 'float'})
    lateFeePerDay: number;
}