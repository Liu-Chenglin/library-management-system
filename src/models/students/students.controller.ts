import {Body, Controller, Delete, HttpCode, Param, Post, UseFilters, UsePipes, ValidationPipe} from "@nestjs/common";
import {HttpExceptionFilter} from "../../common/exceptions/handlers/http-exception.filter";
import {StudentsService} from "./students.service";
import {CreateStudentDto} from "./dto/create-student.dto";
import {Student} from "./student";


@Controller('/students')
@UseFilters(new HttpExceptionFilter())
export class StudentsController {
    constructor(private readonly studentsService: StudentsService) {
    }

    @Post()
    @UsePipes(new ValidationPipe())
    async createStudent(@Body() createStudentDto: CreateStudentDto): Promise<Student> {
        return await this.studentsService.create(createStudentDto);
    }

    @Delete(':id')
    @HttpCode(204)
    async deleteStudent(@Param('id') studentId: number) {
        await this.studentsService.delete(studentId);
    }
}