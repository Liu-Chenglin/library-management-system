export class CreateBookDto {
    title: string;
    author: string;
    publisher: string;
    price: number;
    status: string;
    comment: string;

    constructor(title: string, author: string, publisher: string, price: number, status: string, comment: string) {
        this.title = title;
        this.author = author;
        this.publisher = publisher;
        this.price = price;
        this.status = status;
        this.comment = comment;
    }
}
