import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {BaseEntity} from "../../../common/entities/base.entity";
import {StudentEntity} from "./student.entity";

@Entity({name: 'student_type'})
export class StudentTypeEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    type: string;

    @Column()
    quota: number;

    @OneToMany(() => StudentEntity, student => student.type)
    students: StudentEntity;

    @Column()
    maxLoanPeriod: number;
}