export class Book {
    private _id: number;
    private _title: string;
    private _author: string;
    private _publisher: string;
    private _price: number;
    private _status: string;
    private _comment: string;

    private _late_fee_per_day: number;
    
    constructor(id: number, title: string, author: string, publisher: string, price: number, status: string, comment: string, late_fee_per_day: number) {
        this._id = id;
        this._title = title;
        this._author = author;
        this._publisher = publisher;
        this._price = price;
        this._status = status;
        this._comment = comment;
        this._late_fee_per_day = late_fee_per_day;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get title(): string {
        return this._title;
    }

    set title(value: string) {
        this._title = value;
    }

    get author(): string {
        return this._author;
    }

    set author(value: string) {
        this._author = value;
    }

    get publisher(): string {
        return this._publisher;
    }

    set publisher(value: string) {
        this._publisher = value;
    }

    get price(): number {
        return this._price;
    }

    set price(value: number) {
        this._price = value;
    }

    get status(): string {
        return this._status;
    }

    set status(value: string) {
        this._status = value;
    }

    get comment(): string {
        return this._comment;
    }

    set comment(value: string) {
        this._comment = value;
    }


    get late_fee_per_day(): number {
        return this._late_fee_per_day;
    }

    set late_fee_per_day(value: number) {
        this._late_fee_per_day = value;
    }
}
