import {StudentEntity} from "../../../models/students/entities/student.entity";
import {Student} from "../../../models/students/student";

export class StudentsMapper {

    static toModel(studentEntity: StudentEntity): Student {
        return {
            id: studentEntity.id,
            name: studentEntity.name,
            grade: studentEntity.grade,
            type: studentEntity.type,
            availableQuota: studentEntity.availableQuota,
            phone: studentEntity.phone,
            email: studentEntity.email
        }
    }
}