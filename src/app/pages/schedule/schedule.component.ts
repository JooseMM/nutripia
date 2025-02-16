import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { ButtonComponent } from '../../shared/button/button.component';
import { CalendarComponent } from '../calendar/calendar.component';
import { AppoitmentService } from 'src/app/shared/services/appoitments/appoitments.service';
import { ResponseTrackerService } from 'src/app/shared/services/response-tracker/response-tracker.service';
import Appointment from 'src/models/IAppointment';

@Component({
  selector: 'nt-schedule',
  imports: [CalendarComponent, NgClass, ButtonComponent],
  templateUrl: './schedule.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleComponent {
  appointmentService = inject(AppoitmentService);
  responseTrackerService = inject(ResponseTrackerService);
  getLongDate: Signal<string> = computed(() => {
    const selectedDay = this.appointmentService.getSelectedDate().getDate();
    const selectedMonth = this.appointmentService.getSelectedDate().getMonth();
    return (
      selectedDay +
      ' de ' +
      this.appointmentService.getMonthNameOf(selectedMonth)
    );
  });
  getTime: Signal<string> = computed(() =>
    this.appointmentService
      .getSelectedDate()
      .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  );
  onEditAppointment = computed(() =>
    this.appointmentService.getOnEditAppointment(),
  );
  isAppointmentOnline: WritableSignal<boolean> = signal(false);
  notSelectedClass = 'p-2.5 bg-white rounded-full';
  selectedClass = 'p-2.5 bg-primary-purple rounded-full';
  isResponseLoading: Signal<boolean> = computed(
    () => this.responseTrackerService.getState().isLoading,
  );

  setAppointmentIsOnline(isOnline: boolean) {
    this.isAppointmentOnline.set(isOnline);
  }
  updateHourBy(number: number) {
    this.appointmentService.updateHour(number);
  }
  saveAppointment() {
    this.appointmentService.saveAppointment(this.isAppointmentOnline());
  }
  setOnEditAppointment() {
    this.appointmentService.setOnEditAppointment();
  }
  getDateOwner() {
    const currentSelectedDate = this.appointmentService.getSelectedDate();
    const appointment = this.appointmentService
      .getAppointments()
      .find(
        (appointment: Appointment) =>
          (appointment.date as Date).getTime() ===
          currentSelectedDate.getTime(),
      );
    return appointment?.user?.fullName;
  }
}
