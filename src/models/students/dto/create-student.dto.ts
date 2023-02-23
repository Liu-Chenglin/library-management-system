import {IsEmail, IsInt, IsMobilePhone, IsNotEmpty, IsString} from "class-validator";

export class CreateStudentDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsInt()
    @IsNotEmpty()
    grade: number;

    @IsString()
    @IsNotEmpty()
    type: string;

    @IsMobilePhone('zh-CN')
    @IsNotEmpty()
    phone: number;

    @IsEmail()
    @IsNotEmpty()
    email: string;
}