import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Signal,
} from '@angular/core';
import {
  MONTH_NAMES,
  SINGLE_LETTER_WEEK_DAY,
  THREE_LETTER_WEEKDAY,
} from 'src/app/constants/app-constants';
import { AppoitmentService } from 'src/app/shared/services/appoitments/appoitments.service';
import DayObject from 'src/app/shared/services/appoitments/IDayObject';
import { NgClass } from '@angular/common';
import Appointment from 'src/models/IAppointment';
import { ChangeMonthButtonComponent } from './components/change-month-button/change-month-button.component';
@Component({
  selector: 'nt-calendar',
  imports: [NgClass, ChangeMonthButtonComponent],
  templateUrl: './calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {
  appointmentService = inject(AppoitmentService);
  threeLetterWeekDay = THREE_LETTER_WEEKDAY;
  singleLetterWeekDay = SINGLE_LETTER_WEEK_DAY;
  selectedDate: Signal<Date> = computed(() =>
    this.appointmentService.getSelectedDate(),
  );
  protected daysOfTheMonth: Signal<DayObject[]> = computed(() =>
    this.getDaysInCurrentMonth(
      this.selectedDate().getFullYear(),
      this.selectedDate().getMonth(),
      this.appointmentService.getAppointmentAtSelectedMonth(),
      this.selectedDate(),
    ),
  );
  getMonthName(): string {
    return MONTH_NAMES[this.selectedDate().getMonth()];
  }
  updateMonth(updateBy: number) {
    this.appointmentService.updateMonth(updateBy);
  }
  getBoxDayClass(index: number, day: DayObject, length: number) {
    if (day.appointments.length > 0 && day.isSelected) {
      // box with appointments and selected
      return 'bg-primary-purple text-white ring ring-[3px] ring-inset ring-[#5F5373] ';
    } else if (day.appointments.length > 0) {
      // box with appointments
      return 'bg-primary-purple text-white ring ring-1 ring-inset ring-soft-charcoal | sm:border-l sm:border-b sm:border-soft-charcoal sm:ring-0';
    } else if (day.isSelected) {
      // selected box
      return 'ring ring-inset ring-1 ring-primary-purple sm:ring-soft-charcoal | lg:ring-[3px]';
    } else if (index === length - 1) {
      // last box have no border
      return 'border-none';
    } else if (index > length - 8 && index < length - 1) {
      // last 6 boxes not counting the very last
      return 'sm:border-r';
    } else if (index < 6) {
      // first boxes
      return 'sm:border-r sm:border-b';
    } else if ([6, 13, 20, 27, 34, 41].includes(index)) {
      // last column only
      return 'sm:border-b';
    } else {
      // default box
      return 'sm:border-r sm:border-b';
    }
  }
  newDaySelected(day: number) {
    this.appointmentService.updateSelectedDay(day);
  }
  private getDaysInCurrentMonth(
    year: number,
    month: number,
    appointments: Appointment[],
    currentDate: Date,
  ): DayObject[] {
    /*
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
        isSelected: false,
        appointments: [],
        isDisabled: true,
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
      (_, index) => {
        const numberDay = index + 1;
        const currentAppointments =
          this.appointmentService.getAppointmentByDate(numberDay, month, year);
        return {
          isSelected: currentDate.getDate() === numberDay,
          numberDay: numberDay,
          appointments: currentAppointments,
          isDisabled: currentAppointments.length >= 8,
          /*
           * if there is more than 8 appointments in a day
           * new appointments will not be allowed
           */
        } as DayObject;
      },
    );
    /*
     * in order to not have  a blank space at the end of the calendar in some cases
     * we need to show the next month days in the available boxes left
     *
     * first we check what's our array length so far
     * */
    const combinedArraysLength =
      previousMonthDays.length + selectedMonthDays.length;
    /*
     * why 35? If the calendar needs to fill days in the fith row
     * the length so far will be less than that
     *
     * if its greater than 35 it means that it needs to fill days in the sixth row
     *
     * below we substrack to 35 and 42 to the values of the combined array
     * this gives us the amount of days left to fill
     * */
    const nextMonthDaysLength =
      combinedArraysLength < 35
        ? 35 - combinedArraysLength
        : 42 - combinedArraysLength;

    const nextMonthDays = Array.from(
      { length: nextMonthDaysLength },
      (_, index): DayObject => ({
        isSelected: false,
        isDisabled: true,
        numberDay: index + 1,
        appointments: [],
        /*
         * then we create an array of DayObject and combined it with the rest
         * */
      }),
    );
    return [...previousMonthDays, ...selectedMonthDays, ...nextMonthDays];
  }
}
