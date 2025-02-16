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
  ADMIN_ROLE,
  API_URL,
  MONTH_NAMES,
  WORK_END_HOUR,
  WORK_START_HOUR,
} from 'src/app/constants/app-constants';
import Appointment from 'src/models/IAppointment';
import mockDates from './mockData';
import DayObject from './IDayObject';
import AppointmentDto from 'src/models/IAppointmentDto';
import { ResponseTrackerService } from '../response-tracker/response-tracker.service';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AppoitmentService {
  private http = inject(HttpClient);
  private URL = `${API_URL}/appointments`;
  private AuthService = inject(AuthenticationService);
  private ResponseTrackerService = inject(ResponseTrackerService);
  private selectedDate: WritableSignal<Date> = signal(this.getCurrentDate());
  private appointments = signal(mockDates);
  private onEditAppoitment: WritableSignal<Appointment | null> = signal(null);
  private authenticationState = signal(
    this.AuthService.getAuthenticationState(),
  );
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

  getOnEditAppointment() {
    return this.onEditAppoitment();
  }
  setOnEditAppointment(): void {
    const appointmentsArr = this.appointments();
    this.onEditAppoitment.set(
      appointmentsArr.find(
        (appointment: Appointment) =>
          (appointment.date as Date).getTime() ===
          this.selectedDate().getTime(),
      )!,
    );
  }
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
  updateSelectedDay(newDay: number) {
    const previousDate = this.selectedDate();
    /*
     * get an array of numbers that represents the amount of time
     * that has pass since the EPOCH to be able to compare dates
     */
    const reservedDates: number[] = this.getAppointmentsByMonth(
      this.appointments(),
      previousDate.getMonth(),
    ).map((item) => (item.date as Date).getTime());

    const newDateToCheck = new Date(
      previousDate.getFullYear(),
      previousDate.getMonth(),
      newDay,
      WORK_START_HOUR,
      0,
      0,
    );

    this.selectedDate.set(
      this.getNearestAvailableHour(
        newDateToCheck,
        reservedDates,
        previousDate.getHours(),
      ),
    );
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
  updateHour(updateBy: number): void {
    const selectedDate = this.selectedDate();
    const current = this.selectedDate();
    let newHour = current.getHours() + updateBy;
    /*
     * get an array of numbers that represents the amount of time
     * that has pass since the EPOCH to be able to compare dates
     */
    const reservedDates: number[] = this.getAppointmentsByMonth(
      this.appointments(),
      current.getMonth(),
    ).map((item) => (item.date as Date).getTime());

    /*
     * check if the new hour is between the desire work time
     */
    if (newHour > WORK_END_HOUR || newHour < WORK_START_HOUR) {
      return;
    }
    this.selectedDate.set(
      this.getNearestAvailableHour(
        selectedDate,
        reservedDates,
        newHour,
        updateBy,
      ),
    );
    // Date handles hours to wrap around 24, business logic tell us to only have available hours from 9hrs to 20hrs
  }
  getNearestAvailableHour(
    selectedDate: Date,
    reservedDates: number[],
    newHour: number,
    updateBy?: number,
  ): Date {
    const newSelectedDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      newHour,
      0,
      0,
      0,
    );
    /*
     * a loop that will not stop until it finds an hour
     * that does not exists in th reservedDates array
     * if not valid hours are find
     */
    if (this.authenticationState().role === ADMIN_ROLE) {
      /*
       * jumping to an available hour is not needed as admin
       * because they need to see and manage appointments
       */
      return newSelectedDate;
    }
    while (reservedDates.includes(newSelectedDate.getTime())) {
      newHour += updateBy ?? 1;
      if (newHour < WORK_END_HOUR && newHour > WORK_START_HOUR) {
        newSelectedDate.setHours(newHour);
      } else {
        newSelectedDate.setHours(WORK_START_HOUR);
        updateBy = 1;
      }
    }
    return newSelectedDate;
  }
  saveAppointment(isAppointmentOnline: boolean): void {
    // TODO: add user data to the appointment
    const newAppointment: AppointmentDto = {
      isOnline: isAppointmentOnline,
      date: this.selectedDate(),
      userId: 'user123',
    };
    // for testing purpose
    this.ResponseTrackerService.setResponseState(true, false);
    setTimeout(() => {
      console.log(newAppointment);
      this.ResponseTrackerService.setResponseState(false, true);
      this.appointments.update((prev: Appointment[]) => [
        ...prev,
        {
          ...newAppointment,
          id: 'user09',
          publicId: 'xk02',
          isCompleted: false,
          user: null,
        },
      ]);
    }, 2000);
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
        (appointments.date as Date).getMonth() === monthMatch,
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
            return (appointments.date as Date).getDate() === numberDay;
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
