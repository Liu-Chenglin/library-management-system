import {Test, TestingModule} from '@nestjs/testing';
import {StudentsController} from './students.controller';
import {StudentsService} from './students.service';
import {CreateStudentDto} from "./dto/create-student.dto";
import {Student} from "./student";

describe('StudentsController', () => {
    let studentsController: StudentsController;
    let studentsService: StudentsService;

    const mockStudentsService = {
        create: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [StudentsController],
            providers: [
                {
                    provide: StudentsService,
                    useValue: mockStudentsService,
                },
            ],
        }).compile();

        studentsController = module.get<StudentsController>(StudentsController);
        studentsService = module.get<StudentsService>(StudentsService);
    });

    describe('create', () => {
        const createStudentDto: CreateStudentDto = {
            name: 'John Doe',
            grade: 1,
            type: 'Undergraduate',
            phone: '12345678901',
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
    });
});