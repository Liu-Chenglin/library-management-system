import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {StudentTypeEntity} from "./entities/student-type.entity";

@Injectable()
export class StudentTypeRepository {
    constructor(@InjectRepository(StudentTypeEntity) private readonly repository: Repository<StudentTypeEntity>) {
    }

    async findByType(type: string): Promise<StudentTypeEntity> {
        return await this.repository.findOneBy({type});
    }
}