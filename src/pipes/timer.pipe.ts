import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timer'
})
export class TimerPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): string {

    // Creating a new date Object from the number of seconds
    const date = new Date();
    date.setDate(0);
    date.setMonth(0);
    date.setFullYear(0);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(value);

    // Formating and returning the timer output
    return `${this.formatNumber(date.getHours())}:${this.formatNumber(date.getMinutes())}:${this.formatNumber(date.getSeconds())}`;
  }

  private formatNumber(value: number): string {
    const newValue = value.toString();
    if (newValue.length === 1) {
      return '0' + newValue;
    }
    return newValue;
  }

}
