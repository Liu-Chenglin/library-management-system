import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {BaseEntity} from "../../../common/entities/base.entity";
import {StudentTypeEntity} from "./student-type.entity";

@Entity({name: 'student'})
export class StudentEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    @ManyToOne(() => StudentTypeEntity, studentType => studentType.students)
    type: StudentTypeEntity;

    @Column()
    grade: number;

    @Column()
    availableQuota: number;

    @Column()
    phone: number;

    @Column()
    email: string;
}