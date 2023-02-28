import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {CreateStudentDto} from "./dto/create-student.dto";
import {Student} from "./student";
import {StudentsRepository} from "./students.repository";
import {StudentTypeRepository} from "./student-type.repository";
import {plainToClass} from "class-transformer";
import {StudentEntity} from "./entities/student.entity";
import {StudentsMapper} from "../../utils/mappers/students/students.mapper";
import {StudentTypeMapper} from "../../utils/mappers/students/student-type.mapper";
import {StudentTypeEntity} from "./entities/student-type.entity";

@Injectable()
export class StudentsService {
    constructor(private readonly studentsRepository: StudentsRepository,
                private readonly studentTypeRepository: StudentTypeRepository,
    ) {
    }

    async create(createStudentDto: CreateStudentDto): Promise<Student> {
        const studentTypeEntity = await this.findStudentTypeOrThrow(createStudentDto.type);

        const createdStudentEntity = this.createStudentEntity(createStudentDto, studentTypeEntity);
        const savedStudentEntity = await this.studentsRepository.save(createdStudentEntity);

        const student = StudentsMapper.toModel(savedStudentEntity);
        student.type = StudentTypeMapper.toModel(studentTypeEntity);
        return student;
    }

    async delete(studentId: number) {
        const studentEntity = await this.findOneByIdOrThrow(studentId);
        if (studentEntity.availableQuota !== studentEntity.type.quota) {
            throw new HttpException("Student still have book to return. Cannot delete this student", HttpStatus.BAD_REQUEST);
        }
        await this.studentsRepository.delete(studentId);
    }

    async update(studentId: number, updateStudentDto: CreateStudentDto) {
        const studentEntity = await this.findOneByIdOrThrow(studentId);
        const studentTypeEntity = await this.findStudentTypeOrThrow(updateStudentDto.type);

        studentEntity.name = updateStudentDto.name;
        studentEntity.grade = updateStudentDto.grade;
        studentEntity.type = studentTypeEntity;
        studentEntity.email = updateStudentDto.email;
        studentEntity.phone = updateStudentDto.phone;
        const savedStudentEntity = await this.studentsRepository.save(studentEntity);

        const student = StudentsMapper.toModel(savedStudentEntity);
        student.type = StudentTypeMapper.toModel(studentTypeEntity);
        return student;
    }

    private async findStudentTypeOrThrow(type: string) {
        const studentTypeEntity = await this.studentTypeRepository.findByType(type);

        if (!studentTypeEntity) {
            throw new HttpException("Student Type Not Found: " + type, HttpStatus.NOT_FOUND);
        }

        return studentTypeEntity;
    }

    private createStudentEntity(createStudentDto: CreateStudentDto, studentTypeEntity: StudentTypeEntity) {
        const createdStudentEntity = plainToClass(StudentEntity, createStudentDto);
        createdStudentEntity.availableQuota = studentTypeEntity.quota;
        createdStudentEntity.type = studentTypeEntity;
        return createdStudentEntity;
    }

    async findOneByIdOrThrow(studentId: number) {
        const studentEntity = await this.studentsRepository.findOneById(studentId);
        if (!studentEntity) {
            throw new HttpException('Student Not Found', HttpStatus.NOT_FOUND);
        }
        return studentEntity;
    }

    async find(studentId: number): Promise<Student> {
        const studentEntity = await this.findOneByIdOrThrow(studentId);
        const student = StudentsMapper.toModel(studentEntity);
        student.type = StudentTypeMapper.toModel(studentEntity.type);

        return student;
    }

    async save(studentEntity: StudentEntity): Promise<Student> {
        const savedStudentEntity = await this.studentsRepository.save(studentEntity);

        const student = StudentsMapper.toModel(savedStudentEntity);
        student.type = StudentTypeMapper.toModel(studentEntity.type);
        return student;
    }
}