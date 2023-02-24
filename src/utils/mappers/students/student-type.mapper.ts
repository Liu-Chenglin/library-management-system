import {StudentType} from "../../../models/students/student-type";
import {StudentTypeEntity} from "../../../models/students/entities/student-type.entity";

export class StudentTypeMapper {

    static toModel(studentTypeEntity: StudentTypeEntity): StudentType {
        return {
            id: studentTypeEntity.id,
            type: studentTypeEntity.type,
            quota: studentTypeEntity.quota,
            maxLoanPeriod: studentTypeEntity.maxLoanPeriod
        }
    }
}