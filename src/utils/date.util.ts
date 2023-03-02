export class DateUtil {
    static getFutureDate(startDate: Date, dayOfPeriod: number) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + dayOfPeriod);
        return date;
    }

    static getDayDiff(startDate: Date, endDate: Date) {
        const timeDiff = endDate.getTime() - startDate.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }
}