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
import NewAppointment from 'src/models/INewAppointment';
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

  constructor() {
    this.refreshAppointmentArray();
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
  getSelectedDate(): Date {
    return this.selectedDate();
  }
  getAppointments(): Appointment[] {
    return this.appointmentArray();
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
  }
  updateMonth(updateBy: number): void {
    const newMonth = this.selectedDate().getMonth() + updateBy;
    const isNewMonthValid = newMonth > -1 && newMonth < 12;
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
  saveChanges(): void {
    /*
    this.ResponseTrackerService.setResponseState(true, false);
    if (this.editedAppointment()) {
      console.log('editing');
      appointmentData = {
        ...this.editedAppointment(),
        date: this.selectedDate().toISOString(),
        isOnline: isAppointmentOnline,
        isCompleted: false,
      } as Appointment;
      this.http
        .put<ApiResponse>(this.URL, appointmentData)
        .pipe(
          finalize(() =>
            this.ResponseTrackerService.setResponseState(false, true),
          ),
        )
        .subscribe({
          next: (response: ApiResponse) => {
            if (response.isSuccess) {
              this.appointmentArray.update((oldState: Appointment[]) =>
                oldState.map((item) => {
                  if (item.id === response.data) {
                    item = appointmentAdapter(appointmentData as Appointment);
                  }
                  return item;
                }),
              );
            }
          },
          error: (response: HttpErrorResponse) => {
            throw new Error(response.error);
          },
        });
    } else {
      this.http
        .post<ApiResponse>(this.URL, appointmentData)
        .pipe(
          finalize(() =>
            this.ResponseTrackerService.setResponseState(false, true),
          ),
        )
        .subscribe({
          next: (response: ApiResponse) => {
            if (response.isSuccess) {
              this.appointmentArray.update((oldState: Appointment[]) => [
                ...oldState,
                appointmentAdapter(response.data as Appointment),
              ]);
            }
          },
          error: (response) => console.log(response),
        });
    }
    */
    // mark all is beingEdited to false;
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
