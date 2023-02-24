import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {StudentEntity} from "./entities/student.entity";
import {StudentTypeEntity} from "./entities/student-type.entity";
import {StudentsController} from "./students.controller";
import {StudentsService} from "./students.service";
import {StudentsRepository} from "./students.repository";
import {StudentTypeRepository} from "./student-type.repository";

@Module({
    imports: [TypeOrmModule.forFeature([StudentEntity, StudentTypeEntity])],
    controllers: [StudentsController],
    providers: [StudentsService, StudentsRepository, StudentTypeRepository],
})
export class StudentsModule {
}
