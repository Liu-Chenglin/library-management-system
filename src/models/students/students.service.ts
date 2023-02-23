import {Injectable} from "@nestjs/common";
import {CreateStudentDto} from "./dto/create-student.dto";
import {Student} from "./student";
import {StudentsRepository} from "./students.repository";
import {StudentType} from "./student-type";

@Injectable()
export class StudentsService {
    constructor(private readonly studentsRepository: StudentsRepository,
    ) {
    }
    
    async create(createStudentDto: CreateStudentDto): Promise<Student> {
        return Promise.resolve(new Student(1, createStudentDto.grade,
            new StudentType(), 5, createStudentDto.phone,
            createStudentDto.email));
    }
}