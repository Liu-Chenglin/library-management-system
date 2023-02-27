import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    UseFilters,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
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

    @Patch(':id')
    @UsePipes(new ValidationPipe())
    async updateStudent(@Param('id') studentId: number, @Body() updateStudentDto: CreateStudentDto) {
        return await this.studentsService.update(studentId, updateStudentDto);
    }

    @Get(':id')
    async getStudent(@Param('id') studentId: number) {
        return await this.studentsService.find(studentId);
    }
}