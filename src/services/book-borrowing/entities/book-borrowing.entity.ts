import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {StudentEntity} from "../../../models/students/entities/student.entity";
import {BookEntity} from "../../../models/books/entities/book.entity";
import {BaseEntity} from "../../../common/entities/base.entity";

@Entity('student_borrows_book')
export class BookBorrowingEntity extends BaseEntity {
    @PrimaryGeneratedColumn({type: "bigint"})
    id: number;

    @ManyToOne(() => StudentEntity)
    student: StudentEntity;

    @ManyToOne(() => BookEntity)
    book: BookEntity;

    @Column()
    dueDate: Date;

    @Column({default: false})
    returned: boolean;

    @Column({nullable: true})
    returnDate: Date;
}