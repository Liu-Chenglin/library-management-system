import {Test, TestingModule} from '@nestjs/testing';
import {StudentsController} from './students.controller';
import {StudentsService} from './students.service';
import {CreateStudentDto} from "./dto/create-student.dto";
import {Student} from "./student";
import * as request from "supertest";
import {HttpException, HttpStatus, INestApplication} from "@nestjs/common";
import {AppModule} from "../../app.module";

describe('StudentsController', () => {
    let studentsController: StudentsController;
    let studentsService: StudentsService;
    let app: INestApplication;

    const mockStudentsService = {
        create: jest.fn(),
        delete: jest.fn(),
        update: jest.fn()
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
            controllers: [StudentsController],
            providers: [
                {
                    provide: StudentsService,
                    useValue: mockStudentsService,
                },
            ],
        }).compile();
        app = module.createNestApplication();
        await app.init();

        studentsController = module.get<StudentsController>(StudentsController);
        studentsService = module.get<StudentsService>(StudentsService);
    });

    describe('createStudent', () => {
        const createStudentDto: CreateStudentDto = {
            name: 'John Doe',
            grade: 1,
            type: 'Undergraduate',
            phone: '13912345678',
            email: 'johndoe@example.com',
        }

        const createdStudent = {
            id: 1,
            availableQuota: 5,
            ...createStudentDto
        } as unknown as Student;

        it('should create student when given student is valid', async () => {
            jest.spyOn(studentsService, 'create').mockResolvedValue(createdStudent);

            const result = await studentsController.createStudent(createStudentDto);

            expect(studentsService.create).toHaveBeenCalledWith(createStudentDto);
            expect(result).toEqual(createdStudent);
        });

        it('should return BAD REQUEST when given student has invalid phone number', async () => {
            const {phone, ...invalidCreateStudentDto} = createStudentDto;
            const incorrectCreateStudentDto = {phone: '1391234567', ...invalidCreateStudentDto};

            const response = await request(app.getHttpServer())
                .post('/students')
                .send(incorrectCreateStudentDto)
                .expect(HttpStatus.BAD_REQUEST);

            expect(response.body.message.message).toContain('phone must be a phone number');
        });

        it('should return BAD REQUEST when given student missing email', async () => {
            const {email, ...invalidCreateStudentDto} = createStudentDto;

            const response = await request(app.getHttpServer())
                .post('/students')
                .send(invalidCreateStudentDto)
                .expect(HttpStatus.BAD_REQUEST);

            expect(response.body.message.message).toContain('email must be an email');
        });
    });

    describe('deleteStudent', () => {
        it('should delete the student when given student exists', async () => {
            jest.spyOn(studentsService, 'delete').mockImplementation();

            await request(app.getHttpServer())
                .delete('/students/1')
                .expect(HttpStatus.NO_CONTENT);
        });

        it('should return NOT FOUND when given student does not exist', async () => {
            jest.spyOn(studentsService, 'delete').mockRejectedValue(new HttpException('Student Not Found', HttpStatus.NOT_FOUND));

            await expect(studentsController.deleteStudent(1)).rejects.toThrow(HttpException);
        });
    });

    describe('updateStudent', () => {
        it('should update grade of a student', async () => {
            const updateStudentDto = {
                name: 'John Doe',
                grade: 2,
                type: 'Undergraduate',
                phone: '13912345678',
                email: 'johndoe@example.com',
            }
            const updatedStudent = {
                id: 1,
                availableQuota: 5,
                ...updateStudentDto
            } as unknown as Student;
            jest.spyOn(studentsService, 'update').mockResolvedValue(updatedStudent);

            const student = await studentsController.updateStudent(1, updateStudentDto);

            expect(student).toEqual(updatedStudent);
        });
    })
});