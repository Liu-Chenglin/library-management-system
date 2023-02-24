import {IsEmail, IsInt, IsMobilePhone, IsString} from "class-validator";

export class CreateStudentDto {
    @IsString()
    name: string;

    @IsInt()
    grade: number;

    @IsString()
    type: string;

    @IsMobilePhone('zh-CN')
    phone: string;

    @IsEmail()
    email: string;
}