import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {CreateStudentDto} from "./dto/create-student.dto";
import {Student} from "./student";
import {StudentsRepository} from "./students.repository";
import {StudentTypeRepository} from "./student-type.repository";
import {plainToClass} from "class-transformer";
import {StudentEntity} from "./entities/student.entity";
import {StudentsMapper} from "../../utils/mappers/students/students.mapper";
import {StudentTypeMapper} from "../../utils/mappers/students/student-type.mapper";

@Injectable()
export class StudentsService {
    constructor(private readonly studentsRepository: StudentsRepository,
                private readonly studentTypeRepository: StudentTypeRepository,
    ) {
    }

    async create(createStudentDto: CreateStudentDto): Promise<Student> {
        const studentTypeEntity = await this.studentTypeRepository.findByType(createStudentDto.type);

        if (!studentTypeEntity) {
            throw new HttpException("Student Type Not Found: " + createStudentDto.type, HttpStatus.NOT_FOUND);
        }

        const createdStudentEntity = plainToClass(StudentEntity, createStudentDto);
        createdStudentEntity.availableQuota = studentTypeEntity.quota;
        createdStudentEntity.type = studentTypeEntity;

        const savedStudentEntity = await this.studentsRepository.save(createdStudentEntity);

        const student = StudentsMapper.toModel(savedStudentEntity);
        student.type = StudentTypeMapper.toModel(studentTypeEntity);
        return student;
    }
}