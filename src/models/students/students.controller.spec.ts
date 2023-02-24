import {Test, TestingModule} from '@nestjs/testing';
import {StudentsController} from './students.controller';
import {StudentsService} from './students.service';
import {CreateStudentDto} from "./dto/create-student.dto";
import {Student} from "./student";
import * as request from "supertest";
import {HttpStatus, INestApplication} from "@nestjs/common";
import {AppModule} from "../../app.module";

describe('StudentsController', () => {
    let studentsController: StudentsController;
    let studentsService: StudentsService;
    let app: INestApplication;

    const mockStudentsService = {
        create: jest.fn(),
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

    describe('create', () => {
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
});