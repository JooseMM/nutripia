import {
  ChangeDetectorRef,
  Component,
  inject,
  input,
  Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  MONTH_NAMES,
  SINGLE_LETTER_WEEK_DAY,
  THREE_LETTER_WEEKDAY,
} from 'src/app/constants/app-constants';
import { CalendarButtonComponent } from '../calendar-button/calendar-button.component';
import { CalendarButtonState } from '../calendar-button/utils';

interface DayObject {
  state: CalendarButtonState;
  numberDay: number;
}
@Component({
  selector: 'nt-calendar',
  imports: [CalendarButtonComponent],
  templateUrl: './calendar.component.html',
})
export class CalendarComponent {
  currentDate = new Date();
  month = input<number>(this.currentDate.getMonth());
  threeLetterWeekDay = THREE_LETTER_WEEKDAY;
  singleLetterWeekDay = SINGLE_LETTER_WEEK_DAY;
  monthNames = [...MONTH_NAMES];
  selectedDayIndex: number | null = null;
  daysOfTheMonth: DayObject[] = this.getDaysInMonth();
  crd = inject(ChangeDetectorRef);

  selectADay(index: number) {
    this.selectedDayIndex = index;
    console.log(this.selectedDayIndex);
    this.crd.markForCheck();
  }
  getDaysInMonth(): DayObject[] {
    /*
     * TODO: create a variable that checks if the day is taken
     * getting info from external api will be needed
     *
     *  the 0 in Date objects represent the last day
        of the previous month, this returns the amount of days.
        months in js start at 0, so saying the 0 day in month 1
        equals to the last day in january
    */
    const numberOfDays = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      0,
    ).getDate();
    /*
     * create and return an array with the same length as
     * the days of the selected month that hold an DayObject
     * */
    return Array.from(
      { length: numberOfDays },
      (_, index) =>
        ({
          state: this.selectedDayIndex === index ? 'selected' : 'normal',
          numberDay: index + 1,
        }) as DayObject,
    );
  }
  getMonthName() {
    return this.monthNames[this.month()];
  }
}
