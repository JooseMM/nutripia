import {
  ChangeDetectorRef,
  Component,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  MONTH_NAMES,
  SINGLE_LETTER_WEEK_DAY,
  THREE_LETTER_WEEKDAY,
} from 'src/app/constants/app-constants';
import { CalendarButtonComponent } from '../calendar-button/calendar-button.component';
import { CalendarButtonState } from '../calendar-button/utils';
import { Subscription } from 'rxjs';

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
  month = signal(this.currentDate.getMonth());
  year = signal(this.currentDate.getFullYear());
  calendarSubscription: Subscription = new Subscription();
  threeLetterWeekDay = THREE_LETTER_WEEKDAY;
  singleLetterWeekDay = SINGLE_LETTER_WEEK_DAY;
  monthNames = [...MONTH_NAMES];
  fullDays = [14, 23, 10]; // TODO: get this from a service
  selectedDayIndex: WritableSignal<number> = signal(-1);
  daysOfTheMonth: WritableSignal<DayObject[]> = signal(this.getDaysInMonth());
  cdr = inject(ChangeDetectorRef);

  selectADay(newIndex: number) {
    const oldIndex = this.selectedDayIndex();
    /*
     * condition to know is the last index had a state of full or if its the same index
     * if this is true, then the selected button is updated if not its not touched
     */
    if (
      this.daysOfTheMonth()[newIndex].state !== 'full' &&
      oldIndex !== newIndex
    ) {
      this.daysOfTheMonth.update((prev: DayObject[]) => {
        const current: DayObject[] = [...prev];
        /*
         * -1 is used as an null value
         * if the value is null the state is not gonna be updated
         */
        if (oldIndex !== -1) {
          current[oldIndex].state = 'normal';
        }
        /*
         * change the state of the desire day to 'selected'
         */
        current[newIndex].state = 'selected';
        return [...current];
      });
      this.selectedDayIndex.set(newIndex); // update the signal
    }
  }
  renderNextMonth() {
    this.month.update((prev) => ++prev);
    this.daysOfTheMonth.set(this.getDaysInMonth());
    console.log(this.getDaysInMonth().length);
  }
  renderPreviousMonth() {}
  getDaysInMonth(): DayObject[] {
    /*
     * getting info from external api will be needed
     *
     * the 0 in Date objects represent the last day
     * of the previous month, this returns the amount of days.
     * months in js start at 0, so saying the 0 day in month 1
     * equals to the last day in january
     **/
    const lastDayOfSelectedDays = new Date(
      this.year(),
      this.month() + 1,
      0,
    ).getDate();
    const firstDayOfSelectedMonth = new Date(this.year(), this.month(), 1);
    const lastDayOfPreviousMonth = new Date(
      this.year(),
      this.month(),
      0,
    ).getDate();
    /*
     * get the day of the week from sunday (0) to Saturday (6)
     * because our format starts with monday(0) to Sunday(6) we need to
     * add one to every given value, but to ensure this does not go beyond 6
     * we add 6 to the value then we find the reminder when dive by 7
     * causing the result to always wrap around 6
     */
    const monthStartAtDay = (firstDayOfSelectedMonth.getDay() + 6) % 7;
    const previousMonthDays = Array.from(
      { length: monthStartAtDay },
      (_, index): DayObject => ({
        state: 'disable',
        numberDay: lastDayOfPreviousMonth - (monthStartAtDay - 1 - index),
        /*
         * to accurately show the last days of the month
         * we need to substract one from the amount of day that
         * belongs to the previous month array length (monthStartAtDay - 1),
         * substract the current index (monthStartAtDay - 1 - index)
         * to later substract that value to the last day of the previous month
         *
         * */
      }),
    );
    /*
     * create and return an array with the same length as
     * the days of the selected month that hold an DayObject
     * */
    const selectedMonthDays = Array.from(
      { length: lastDayOfSelectedDays },
      (_, index) =>
        ({
          state: this.fullDays.includes(index + 1) // check for full days and mark them as not available
            ? 'full'
            : 'normal',
          numberDay: index + 1,
        }) as DayObject,
    );

    return [...previousMonthDays, ...selectedMonthDays];
  }
  getMonthName() {
    return this.monthNames[this.month()];
  }
}
