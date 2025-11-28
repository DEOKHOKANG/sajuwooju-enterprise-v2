/**
 * Type definitions for lunar-javascript
 * @see https://github.com/6tail/lunar-javascript
 */

declare module 'lunar-javascript' {
  export class Solar {
    constructor(year: number, month: number, day: number);
    static fromDate(date: Date): Solar;
    getLunar(): Lunar;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
  }

  export class Lunar {
    constructor(year: number, month: number, day: number, hour?: number, minute?: number, second?: number);
    static fromDate(date: Date): Lunar;
    static fromYmd(year: number, month: number, day: number, leap?: number): Lunar;
    getSolar(): Solar;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    isLeap(): boolean;
    getYearInChinese(): string;
    getMonthInChinese(): string;
    getDayInChinese(): string;
    getYearInGanZhi(): string;
    getMonthInGanZhi(): string;
    getDayInGanZhi(): string;
    getTimeInGanZhi(): string;
    getYearShengXiao(): string;
  }
}
