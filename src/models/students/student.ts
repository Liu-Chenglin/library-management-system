import {StudentType} from "./student-type";

export class Student {
    private _id: number;

    private _grade: number;

    private _type: StudentType;

    private _availableQuota: number;

    private _phone: number;

    private _email: string;


    constructor(id: number, grade: number, type: StudentType, availableQuota: number, phone: number, email: string) {
        this._id = id;
        this._grade = grade;
        this._type = type;
        this._availableQuota = availableQuota;
        this._phone = phone;
        this._email = email;
    }


    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get grade(): number {
        return this._grade;
    }

    set grade(value: number) {
        this._grade = value;
    }

    get type(): StudentType {
        return this._type;
    }

    set type(value: StudentType) {
        this._type = value;
    }

    get availableQuota(): number {
        return this._availableQuota;
    }

    set availableQuota(value: number) {
        this._availableQuota = value;
    }

    get phone(): number {
        return this._phone;
    }

    set phone(value: number) {
        this._phone = value;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }
}