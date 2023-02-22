export class BookInformation {
    private _id: number;

    private _title: string;

    private _author: string;

    private _publisher: string;

    private _price: number;

    private _totalInventory: number;

    private _availableInventory: number;

    private _lateFeePerDay: number;


    constructor(id: number, title: string, author: string, publisher: string, price: number, totalInventory: number, availableInventory: number, lateFeePerDay: number) {
        this._id = id;
        this._title = title;
        this._author = author;
        this._publisher = publisher;
        this._price = price;
        this._totalInventory = totalInventory;
        this._availableInventory = availableInventory;
        this._lateFeePerDay = lateFeePerDay;
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

    get totalInventory(): number {
        return this._totalInventory;
    }

    set totalInventory(value: number) {
        this._totalInventory = value;
    }

    get availableInventory(): number {
        return this._availableInventory;
    }

    set availableInventory(value: number) {
        this._availableInventory = value;
    }

    get lateFeePerDay(): number {
        return this._lateFeePerDay;
    }

    set lateFeePerDay(value: number) {
        this._lateFeePerDay = value;
    }
}