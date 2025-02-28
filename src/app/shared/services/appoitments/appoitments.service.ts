import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  effect,
  inject,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  API_URL,
  WORK_END_HOUR,
  WORK_START_HOUR,
} from 'src/app/constants/app-constants';
import Appointment from 'src/models/IAppointment';
import { ResponseTrackerService } from '../response-tracker/response-tracker.service';
import { AuthenticationService } from '../authentication/authentication.service';
import ApiResponse from 'src/models/IApiResponse';
import { finalize } from 'rxjs';
import { appointmentAdapter } from 'src/app/pages/login/adapter/AppointmentAdapter';
import AppointmentDto from 'src/models/IAppointmentDto';
import AuthenticationState from 'src/models/IAuthenticationState';

@Injectable({
  providedIn: 'root',
})
export class AppoitmentService {
  private http = inject(HttpClient);
  private URL = `${API_URL}/appointments`;
  private AuthService = inject(AuthenticationService);
  private ResponseTrackerService = inject(ResponseTrackerService);
  private selectedDate: WritableSignal<Date> = signal(this.getCurrentDate());
  private appointmentArray: WritableSignal<Appointment[]> = signal([]);
  private authenticationState = signal(
    this.AuthService.getAuthenticationState(),
  );
  private scrollTrigger = signal(false);

  constructor() {
    this.refreshAppointmentArray();
  }
  toggleCompletedState(id: string): void {
    this.appointmentArray.update((bank) =>
      bank.map((item) => {
        if (item.id === id) {
          item.isCompleted = !item.isCompleted;
        }
        return item;
      }),
    );
  }
  toggleScrollTrigger() {
    this.scrollTrigger.update((state) => !state);
  }
  getScrollTrigger(): boolean {
    return this.scrollTrigger();
  }
  deleteOnById(id: string) {
    if (!id) {
      throw new Error('id not provided, unable to delete');
    }
    this.http
      .delete<ApiResponse>(`${this.URL}/${id}`)
      .pipe(
        finalize(() =>
          this.ResponseTrackerService.setResponseState(false, true),
        ),
      )
      .subscribe({
        next: () => {
          this.appointmentArray.update((bank) =>
            bank.filter((appointment) => appointment.id !== id),
          );
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  refreshAppointmentArray() {
    this.http
      .get<ApiResponse>(this.URL)
      .pipe(
        finalize(() =>
          this.ResponseTrackerService.setResponseState(false, true),
        ),
      )
      .subscribe({
        next: (response: ApiResponse) => {
          if (response.isSuccess) {
            const appointmentArray: Appointment[] = (
              response.data as AppointmentDto[]
            ).map((item) => appointmentAdapter(item));
            this.appointmentArray.set(appointmentArray);
          }
        },
        error: (response: HttpErrorResponse) => {
          throw new Error(response.error);
        },
      });
  }
  createOrModify(id: string): void {
    if (id) {
      const target = this.appointmentArray().find((item) => item.id === id);
      if (!target) {
        throw new Error('not found appointment');
      }
      this.appointmentArray.update((oldState) =>
        oldState.map((appointment) => {
          if (appointment.id === id) {
            appointment.isBeingEdited = true;
          }
          return appointment;
        }),
      );
    } else {
      const newAppointment: Appointment = {
        id: '',
        isBeingEdited: true,
        isOnline: false,
        isCompleted: false,
        date: this.selectedDate(),
        userId: this.authenticationState().id,
      };
      this.appointmentArray.update((oldState) => [...oldState, newAppointment]);
    }
  }
  removeNotFinished(): void {
    this.appointmentArray.update((oldState) =>
      oldState.filter((item) => !item.isBeingEdited),
    );
  }
  cancelModification() {
    this.appointmentArray.update((oldState) =>
      oldState.map((item) => {
        if (item.isBeingEdited) {
          item.isBeingEdited = false;
        }
        return item;
      }),
    );
  }
  getSelectedDate(): Date {
    return this.selectedDate();
  }
  getAppointments(): Appointment[] {
    return this.appointmentArray();
  }
  getAppointmentAtSelectedMonth() {
    return this.appointmentArray().filter(
      (appointments) =>
        appointments.date.getMonth() === this.selectedDate().getMonth() &&
        appointments.date.getFullYear() === this.selectedDate().getFullYear(),
    ); // appointments at current month
  }
  updateSelectedDay(newDay: number) {
    this.selectedDate.update(
      (prev) =>
        new Date(
          prev.getFullYear(),
          prev.getMonth(),
          newDay,
          WORK_START_HOUR,
          0,
          0,
        ),
    );
    this.toggleScrollTrigger();
  }
  updateMonth(updateBy: number): void {
    const newMonth = this.selectedDate().getMonth() + updateBy;
    const currentMonth = new Date().getMonth();
    const isNewMonthValid = newMonth >= currentMonth && newMonth < 12;
    /*
     * Dont update is the operation is not valid
     */
    if (!isNewMonthValid) {
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
    let newHour = selectedDate.getHours() + updateBy;
    /*
     * check if the new hour is between the desire work time
     */
    if (newHour > WORK_END_HOUR || newHour < WORK_START_HOUR) {
      return;
    }
    this.selectedDate.set(
      new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        newHour,
        0,
        0,
        0,
      ),
    );
    // Date handles hours to wrap around 24, business logic tell us to only have available hours from 9hrs to 20hrs
  }
  isSelectedDateInThePast(selectedDate: Date): boolean {
    const currentDate = new Date();
    const isMonthInThePast = currentDate.getMonth() > selectedDate.getMonth(); // si el mes es mayor o igual al seleccionado ?
    const isDayInThePast = currentDate.getDate() > selectedDate.getDate();
    const isYearInThePastOrTooSoon =
      currentDate.getFullYear() > selectedDate.getFullYear();
    const isCurrentMonth = currentDate.getMonth() === selectedDate.getMonth();

    if (isYearInThePastOrTooSoon) {
      console.log('past year');
      return true;
    } else if (isMonthInThePast) {
      console.log('past month');
      return true;
    } else if (isDayInThePast && isCurrentMonth) {
      console.log('past day');
      return true;
    }
    return false;
  }
  isHourValid(): boolean {
    const currentDate = new Date();
    const isHourInThePast =
      currentDate.getHours() > this.selectedDate().getHours();
    const isTooSoon =
      currentDate.getHours() + 4 > this.selectedDate().getHours();

    if (isHourInThePast) {
      return false;
    } else if (isTooSoon) {
      return false;
    }
    return true;
  }
  isDateAndTimeNotTaken(): boolean {
    const appointmentBank = this.appointmentArray();
    const selectedDate = this.selectedDate();

    if (this.isSelectedDateInThePast(this.selectedDate())) {
      return false;
    }
    const found = appointmentBank.find(
      (item) =>
        item.date.getFullYear() === selectedDate.getFullYear() &&
        item.date.getMonth() === selectedDate.getMonth() &&
        item.date.getDate() === selectedDate.getDate() &&
        item.date.getHours() === selectedDate.getHours() &&
        !item.isCompleted &&
        !item.isBeingEdited,
    );
    return !found ? true : false;
  }
  didUserReachLimit(
    currentUser: AuthenticationState,
    selectedDate: Date,
  ): boolean {
    let counter = 0;
    this.appointmentArray().forEach((item) => {
      const userMatch = item.userId === currentUser.id;
      const monthMatch = item.date.getMonth() === selectedDate.getMonth();
      const yearMatch = item.date.getFullYear() === selectedDate.getFullYear();
      const excludeCurrentCreation = item.id !== '' && !item.isBeingEdited; // to not count the one being currently created or modified

      if (userMatch && monthMatch && yearMatch && excludeCurrentCreation) {
        counter += 1;
      }
    });
    return counter >= 2 ? true : false;
  }
  saveChanges(): void {
    this.ResponseTrackerService.setResponseState(true, false);
    const toSaveAppointment = this.appointmentArray().find(
      (item) => item.isBeingEdited,
    );
    if (!toSaveAppointment) {
      throw new Error('no appointment to save');
    }

    toSaveAppointment.date = this.selectedDate();

    if (toSaveAppointment.id) {
      this.http
        .put<ApiResponse>(this.URL, toSaveAppointment)
        .pipe(
          finalize(() =>
            this.ResponseTrackerService.setResponseState(false, true),
          ),
        )
        .subscribe({
          next: (res: ApiResponse) => {
            if (!res.isSuccess) {
              throw new Error(res.error);
            }
            this.appointmentArray.update((oldState) =>
              oldState.map((item) => {
                if (item.isBeingEdited) {
                  item.isBeingEdited = false;
                }
                return item;
              }),
            );
          },
          error: () => {},
        });
    } else {
      this.http
        .post<ApiResponse>(this.URL, toSaveAppointment)
        .pipe(
          finalize(() =>
            this.ResponseTrackerService.setResponseState(false, true),
          ),
        )
        .subscribe({
          next: (res: ApiResponse) => {
            if (!res.isSuccess) {
              throw new Error(res.error);
            }

            this.appointmentArray.update((oldState) =>
              oldState.map((item) => {
                console.log(item.userId);
                if (item.id === '') {
                  item.id = res.data as string;
                  item.isBeingEdited = false;
                }
                return item;
              }),
            );
          },
        });
    }
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
}
