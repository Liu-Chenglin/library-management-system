export class DateUtil {
    static getFutureDate(startDate: Date, dayOfPeriod: number) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + dayOfPeriod);
        return date;
    }
}