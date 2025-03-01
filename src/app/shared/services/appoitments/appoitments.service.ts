import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
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
  private shouldStopEditing = signal(false);

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
  setAppointmentMode(isOnline: boolean): void {
    this.appointmentArray.update((arr) =>
      arr.map((appointment) => {
        if (appointment.isBeingEdited) {
          appointment.isOnline = isOnline;
        }
        return appointment;
      }),
    );
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
  isCreatingOrModifiying(): boolean {
    const found = this.appointmentArray().find((item) => item.isBeingEdited);
    return found !== undefined; // if found is not null return true otherwise false
  }
  createOrModify(id: string): void {
    const current = new Date();
    const targetTime = new Date(
      current.getFullYear(),
      current.getMonth(),
      current.getDate(),
      this.getAValidHour(),
      0,
      0,
      0,
    );
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
        date: targetTime,
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
  getAppointmentById(idToMatch: string): Appointment {
    const match = this.appointmentArray().find(
      (appointment) => appointment.id === idToMatch,
    );
    if (!match) {
      throw new Error('not found');
    }
    return match;
  }
  getShouldStopEditing(): boolean {
    return this.shouldStopEditing();
  }
  toggleShouldStopEditing(): void {
    this.shouldStopEditing.update((state) => !state);
  }
  getSelectedDate(): Date {
    return this.selectedDate();
  }
  getAppointments(): Appointment[] {
    return this.appointmentArray();
  }
  getAppointmentBeingModify(): Appointment[] {
    return this.appointmentArray().filter(
      (appointment) => appointment.isBeingEdited,
    );
  }
  getAppointmentByDate(
    day: number,
    month: number,
    year: number,
  ): Appointment[] {
    return this.appointmentArray().filter(
      (appointment) =>
        appointment.date.getFullYear() === year &&
        appointment.date.getMonth() === month &&
        appointment.date.getDate() === day,
    );
  }
  getAppointmentAtSelectedMonth() {
    return this.appointmentArray()
      .filter(
        (appointments) =>
          appointments.date.getMonth() === this.selectedDate().getMonth() &&
          appointments.date.getFullYear() === this.selectedDate().getFullYear(),
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }
  updateSelectedDay(newDay: number) {
    this.selectedDate.update(
      (prev) =>
        new Date(
          prev.getFullYear(),
          prev.getMonth(),
          newDay,
          this.getAValidHour(),
          0,
          0,
        ),
    );
    this.toggleScrollTrigger();
    if (!this.isCreatingOrModifiying()) {
      this.toggleShouldStopEditing();
    }
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
        this.getAValidHour(),
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
  isSelectedDateInThePast(): boolean {
    const selected = this.selectedDate();
    const currentDate = new Date();
    return currentDate.getTime() > selected.getTime();
  }

  isDateAndTimeNotTaken(): boolean {
    const selectedDate = this.selectedDate();
    const found = this.appointmentArray().find(
      (item) =>
        item.date.getTime() === selectedDate.getTime() &&
        !item.isCompleted &&
        !item.isBeingEdited,
    );
    return !found ? true : false;
  }
  didUserReachLimit(): boolean {
    const selectedDate = this.selectedDate();
    const currentUser = this.authenticationState();
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
          error: (error) => {
            console.log(error);
          },
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
                if (item.isBeingEdited) {
                  item = appointmentAdapter(res.data as AppointmentDto);
                }
                return item;
              }),
            );
          },
          error: (error) => console.log(error),
        });
    }
  }
  private getCurrentDate(): Date {
    const now = new Date();

    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      this.getAValidHour(),
      0,
      0,
      0,
    );
  }
  getAValidHour(): number {
    const now = new Date();
    const invalidHour =
      now.getHours() > WORK_END_HOUR || now.getHours() < WORK_START_HOUR;
    return invalidHour ? WORK_START_HOUR : now.getHours();
  }
}
