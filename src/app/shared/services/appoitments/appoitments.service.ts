import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import {
  ADMIN_ROLE,
  API_URL,
  MONTH_NAMES,
  WORK_END_HOUR,
  WORK_START_HOUR,
} from 'src/app/constants/app-constants';
import Appointment from 'src/models/IAppointment';
import mockDates from './mockData';
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
  private editedAppointment: WritableSignal<Appointment | null> = signal(null);
  private authenticationState = signal(
    this.AuthService.getAuthenticationState(),
  );

  getEditedAppointment() {
    return this.editedAppointment();
  }
  startEditingAppointment(appointment: Appointment | null): void {
    this.editedAppointment.set(appointment);
  }
  getSelectedDate(): Date {
    return this.selectedDate();
  }
  getAppointments(): Appointment[] {
    return this.appointments();
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
  saveChanges(isAppointmentOnline: boolean): void {
    // TODO: add user data to the appointment
    const newAppointment: AppointmentDto = {
      isOnline: isAppointmentOnline,
      date: this.selectedDate(),
      userId: this.authenticationState().id,
    };
    if (this.editedAppointment()) {
      const updatedAppointment: AppointmentDto = {
        ...this.editedAppointment(),
        date: this.selectedDate(),
        userId: this.editedAppointment()?.userId!,
        isOnline: isAppointmentOnline,
      };
      //for testing
      setTimeout(
        () =>
          this.appointments.update((prev) =>
            prev.map((appointment) => {
              if (appointment.id === this.editedAppointment()?.id) {
                appointment = { ...appointment, ...updatedAppointment };
              }
              return appointment;
            }),
          ),
        2000,
      );
    }
    // for testing purpose
    this.ResponseTrackerService.setResponseState(true, false);
    setTimeout(() => {
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
  getAppointmentsByMonth(
    appointments: Appointment[],
    monthMatch: number,
  ): Appointment[] {
    return appointments.filter(
      (appointments: Appointment) =>
        (appointments.date as Date).getMonth() === monthMatch,
    );
  }
}
