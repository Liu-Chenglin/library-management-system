import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {StudentEntity} from "./entities/student.entity";

@Injectable()
export class StudentsRepository {
    constructor(@InjectRepository(StudentEntity) private readonly repository: Repository<StudentEntity>) {
    }
}