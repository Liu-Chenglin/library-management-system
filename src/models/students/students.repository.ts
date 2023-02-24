import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {StudentEntity} from "./entities/student.entity";

@Injectable()
export class StudentsRepository {
    constructor(@InjectRepository(StudentEntity) private readonly repository: Repository<StudentEntity>) {
    }

    create(studentEntity: StudentEntity): StudentEntity {
        return this.repository.create(studentEntity);
    }

    async save(studentEntity: StudentEntity): Promise<StudentEntity> {
        return await this.repository.save(studentEntity);
    }

    async findOneById(studentId: number) {
        return await this.repository.findOneBy({id: studentId});
    }

    async delete(studentId: number) {
        await this.repository.softDelete(studentId);
    }
}