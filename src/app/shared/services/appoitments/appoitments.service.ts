import { HttpClient } from '@angular/common/http';
import {
  computed,
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  API_URL,
  MONTH_NAMES,
  WORK_END_HOUR,
  WORK_START_HOUR,
} from 'src/app/constants/app-constants';
import Appointment from 'src/models/IAppointment';
import mockDates from './mockData';
import DayObject from './IDayObject';

@Injectable({
  providedIn: 'root',
})
export class AppoitmentService {
  private http = inject(HttpClient);
  private URL = `${API_URL}/appointments`;
  private selectedDate: WritableSignal<Date> = signal(this.getCurrentDate());
  private appointments = signal(mockDates);
  private daysOfTheMonth: Signal<DayObject[]> = computed(() =>
    this.getDaysInCurrentMonth(
      this.selectedDate().getFullYear(),
      this.selectedDate().getMonth(),
      this.getAppointmentsByMonth(
        this.appointments(),
        this.selectedDate().getMonth(),
      ),
      this.selectedDate().getDate(),
    ),
  );

  getSelectedDate(): Date {
    return this.selectedDate();
  }
  getDaysOfTheMonth(): DayObject[] {
    return this.daysOfTheMonth();
  }
  getAppointments(): Appointment[] {
    return this.appointments();
  }
  getMonthNameOf(monthIndex: number): string {
    return MONTH_NAMES[monthIndex];
  }
  updateMonth(updateBy: number): void {
    const newMonth = this.selectedDate().getMonth() + updateBy;
    const isOperationValid = newMonth > -1 && newMonth < 12;
    /*
     * Dont update is the operation is not valid
     */
    if (!isOperationValid) {
      return;
    }
    const currentDate = this.selectedDate();
    this.selectedDate.set(
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
  updateHour(updateBy: number) {
    const currentHours = this.selectedDate().getHours() + updateBy;
    // Date handles hours to wrap around 24, business logic tell us to only have available hours from 9hrs to 20hrs
    const validOperation =
      currentHours <= WORK_END_HOUR && currentHours >= WORK_START_HOUR;
    if (validOperation) {
      this.selectedDate.update((prev) => {
        return new Date(
          prev.getFullYear(),
          prev.getMonth(),
          prev.getDate(),
          currentHours,
          0,
          0,
          0,
        );
      });
    }
  }
  saveAppointment(): void {
    // TODO: check the validity of the input to save
  }
  private getCurrentDate(): Date {
    const now = new Date();
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      WORK_START_HOUR,
      0,
      0,
      0,
    );
  }
  private getAppointmentsByMonth(
    appointments: Appointment[],
    monthMatch: number,
  ): Appointment[] {
    return appointments.filter(
      (appointments: Appointment) =>
        (appointments.appointmentDateTime as Date).getMonth() === monthMatch,
    );
  }
  private getDaysInCurrentMonth(
    year: number,
    month: number,
    appointments: Appointment[],
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
    console.log(appointments);
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
        return {
          isSelected: selectedDay === numberDay,
          numberDay: numberDay,
          appointments: appointments.filter((appointments: Appointment) => {
            return (
              (appointments.appointmentDateTime as Date).getDate() === numberDay
            );
          }),
          isDisabled: appointments.length > 8,
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
     * first we check what's out array length so far
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
