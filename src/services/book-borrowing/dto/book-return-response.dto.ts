export class BookReturnResponseDto {
    isOverdue: boolean;

    numberOfDaysOverdue: number;

    lateFeePerDay: number;

    lateFee: number;


    constructor(isOverdue: boolean, numberOfDaysOverdue: number, lateFeePerDay: number, lateFee: number) {
        this.isOverdue = isOverdue;
        this.numberOfDaysOverdue = numberOfDaysOverdue;
        this.lateFeePerDay = lateFeePerDay;
        this.lateFee = lateFee;
    }
}