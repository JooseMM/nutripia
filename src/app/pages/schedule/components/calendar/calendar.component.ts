import { Component, input, OnDestroy, OnInit, signal } from '@angular/core';
import {
  MONTH_NAMES,
  SINGLE_LETTER_WEEK_DAY,
  THREE_LETTER_WEEKDAY,
} from 'src/app/constants/app-constants';
import { CalendarButtonComponent } from '../calendar-button/calendar-button.component';
import { CalendarButtonState } from '../calendar-button/utils';
import { BehaviorSubject, Subscription } from 'rxjs';

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
  selectedDayIndex: number = -1;
  daysOfTheMonth = signal(this.getDaysInMonth());

  selectADay(newIndex: number) {
    const oldIndex = this.selectedDayIndex;
    const wasPreviousDayFull = this.daysOfTheMonth()[oldIndex].state === 'full';

    this.daysOfTheMonth.update((prev) => {
      const current: DayObject[] = [...prev];
      current[oldIndex].state = 'normal';
      current[newIndex].state = 'selected';
      return current;
    });
    this.selectedDayIndex = newIndex;
    //this.daysOfTheMonth[newIndex].state = 'selected';
  }
  renderNextMonth() {
    this.year.update((prev) => prev++);
    this.daysOfTheMonth = this.getDaysInMonth();
  }
  renderPreviousMonth() {}
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
    const numberOfDays = new Date(this.year(), this.month() + 1, 0).getDate();
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
