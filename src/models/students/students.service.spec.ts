import {Test, TestingModule} from '@nestjs/testing';
import {StudentsService} from './students.service';
import {StudentTypeRepository} from './student-type.repository';
import {StudentsRepository} from './students.repository';
import {StudentTypeEntity} from "./entities/student-type.entity";
import {CreateStudentDto} from "./dto/create-student.dto";
import {Student} from "./student";
import {HttpException} from "@nestjs/common";

describe('StudentsService', () => {
    let studentsService: StudentsService;
    let studentTypeRepository: StudentTypeRepository;
    let studentsRepository: StudentsRepository;

    const mockStudentsRepository = {
        save: jest.fn(),
        findOneById: jest.fn(),
        delete: jest.fn(),
    } as unknown as StudentsRepository;

    const mockStudentTypeRepository = {
        findByType: jest.fn(),
    } as unknown as StudentTypeRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StudentsService,
                {
                    provide: StudentsRepository,
                    useValue: mockStudentsRepository
                },
                {
                    provide: StudentTypeRepository,
                    useValue: mockStudentTypeRepository
                },
            ],
        }).compile();

        studentsService = module.get<StudentsService>(StudentsService);
        studentsRepository = module.get<StudentsRepository>(StudentsRepository);
        studentTypeRepository = module.get<StudentTypeRepository>(StudentTypeRepository);
    });

    describe('create', () => {
        const createStudentDto: CreateStudentDto = {
            name: 'Test Student',
            grade: 1,
            type: 'Postgraduate',
            phone: '13912345678',
            email: 'test.student@example.com',
        };

        const studentTypeEntity = {
            id: 2,
            type: 'Postgraduate',
            quota: 10,
            maxLoanPeriod: 21,
            students: [],
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2022-01-01'),
        } as unknown as StudentTypeEntity;

        const createdStudentEntity = {
            id: 1,
            name: 'Test Student',
            grade: 1,
            type: studentTypeEntity,
            availableQuota: 10,
            phone: '13912345678',
            email: 'test.student@example.com',
        };

        const savedStudentEntity = {
            ...createdStudentEntity,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const expectedStudent: Student = {
            id: 1,
            name: 'Test Student',
            grade: 1,
            type: {
                id: 2,
                type: 'Postgraduate',
                quota: 10,
                maxLoanPeriod: 21
            },
            availableQuota: 10,
            phone: '13912345678',
            email: 'test.student@example.com',
        };

        it('should create a new student with valid data', async () => {
            jest.spyOn(studentTypeRepository, 'findByType').mockResolvedValue(studentTypeEntity);
            jest.spyOn(studentsRepository, 'save').mockResolvedValue(savedStudentEntity);

            const result = await studentsService.create(createStudentDto);

            expect(result).toEqual(expectedStudent);
        });

        it('should throw an error if the student type is not found', async () => {
            jest.spyOn(studentTypeRepository, 'findByType').mockResolvedValue(undefined);

            await expect(studentsService.create(createStudentDto)).rejects.toThrow(HttpException);
        });
    });

    describe('delete', () => {
        const studentEntity = {
            id: 1,
            name: 'Test Student',
            grade: 1,
            type: null,
            availableQuota: 10,
            phone: '13912345678',
            email: 'test.student@example.com',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        it('should delete student when student exists', async () => {
            const studentId = 1;

            jest.spyOn(studentsRepository, "findOneById").mockImplementation(() => Promise.resolve(studentEntity));
            jest.spyOn(studentsRepository, "delete").mockImplementation();

            await studentsService.delete(studentId);

            expect(studentsRepository.findOneById).toHaveBeenCalledWith(studentId);
            expect(studentsRepository.delete).toHaveBeenCalledWith(studentId);
        });

        it('should throw exception when student does not exist', async () => {
            jest.spyOn(studentsRepository, "findOneById").mockImplementation(() => Promise.resolve(undefined));
            const invalidStudentId = 1;

            await expect(studentsService.delete(invalidStudentId)).rejects.toThrow(HttpException);

            expect(studentsRepository.findOneById).toHaveBeenCalledWith(invalidStudentId);
        });
    });
});
