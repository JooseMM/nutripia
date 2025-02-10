import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  Signal,
} from '@angular/core';
import {
  MONTH_NAMES,
  SINGLE_LETTER_WEEK_DAY,
  THREE_LETTER_WEEKDAY,
} from 'src/app/constants/app-constants';
import { CalendarButtonComponent } from './components/calendar-button/calendar-button.component';
import { CalendarButtonState } from './utils';
interface DayObject {
  state: CalendarButtonState;
  numberDay: number;
}
@Component({
  selector: 'nt-calendar',
  imports: [CalendarButtonComponent],
  templateUrl: './calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {
  notAvailableDays = input<number[]>([]);
  selectedDate = input.required<Date>();
  dateChange = output<Date>();
  threeLetterWeekDay = THREE_LETTER_WEEKDAY;
  singleLetterWeekDay = SINGLE_LETTER_WEEK_DAY;
  monthNames = [...MONTH_NAMES];
  daysOfTheMonth: Signal<DayObject[]> = computed(() =>
    this.getDaysInMonth(
      this.selectedDate().getFullYear(),
      this.selectedDate().getMonth(),
      this.notAvailableDays(),
      this.selectedDate().getDate(),
    ),
  );

  updateSelectedDate(newDate: Date) {
    this.dateChange.emit(new Date(newDate)); // trigger the event for the parent listener
  }
  selectADay(selectedDay: number) {
    const currentDate = this.selectedDate();

    this.updateSelectedDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        selectedDay,
        currentDate.getHours(),
        0,
        0,
      ),
    );
  }
  updateMonth(updateBy: number) {
    const newMonth = this.selectedDate().getMonth() + updateBy;
    const isOperationValid = newMonth > -1 && newMonth < 12;
    /*
     * Dont update is the operation is not valid
     */
    if (isOperationValid) {
      const currentDate = this.selectedDate();
      this.updateSelectedDate(
        new Date(
          currentDate.getFullYear(),
          newMonth,
          currentDate.getDate(),
          currentDate.getHours(),
          0,
          0,
        ),
      );
    }
  }
  renderPreviousMonth() {}
  getDaysInMonth(
    year: number,
    month: number,
    fullDays: number[],
    selectedDay: number,
  ): DayObject[] {
    /*
     * getting info from external api will be needed
     *
     * the 0 in Date objects represent the last day
     * of the previous month, this returns the amount of days.
     * months in js start at 0, so saying the 0 day in month 1
     * equals to the last day in january
     **/
    const lastDayOfSelectedDays = new Date(year, month + 1, 0).getDate();
    const firstDayOfSelectedMonth = new Date(year, month, 1);
    const lastDayOfPreviousMonth = new Date(year, month, 0).getDate();
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
          state: fullDays.includes(index + 1) // check for full days and mark them as not available
            ? 'full'
            : selectedDay === index + 1
              ? 'selected'
              : 'normal',
          numberDay: index + 1,
        }) as DayObject,
    );

    return [...previousMonthDays, ...selectedMonthDays];
  }
  getMonthName() {
    return this.monthNames[this.selectedDate().getMonth()];
  }
}
