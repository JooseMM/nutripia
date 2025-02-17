import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { AppoitmentService } from 'src/app/shared/services/appoitments/appoitments.service';
import { ButtonComponent } from '../../../../shared/button/button.component';
import {
  ADMIN_ROLE,
  CLIENT_ROLE,
  MONTH_NAMES,
} from 'src/app/constants/app-constants';
import { AuthenticationService } from 'src/app/shared/services/authentication/authentication.service';
import { ResponseTrackerService } from 'src/app/shared/services/response-tracker/response-tracker.service';
import { AppointmentInfoBoxComponent } from './components/appointment-info-box/appointment-info-box.component';
import Appointment from 'src/models/IAppointment';

@Component({
  selector: 'nt-details-sidepanel',
  imports: [NgClass, ButtonComponent, AppointmentInfoBoxComponent],
  templateUrl: './details-sidepanel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsSidepanelComponent {
  /*
   * own fields
   */
  ADMIN_ROLE = ADMIN_ROLE;
  CLIENT_ROLE = CLIENT_ROLE;
  isNewAppointmentOnline: WritableSignal<boolean> = signal(false);
  isNewAppointment: WritableSignal<boolean> = signal(false);
  authenticationService = inject(AuthenticationService);
  appointmentService = inject(AppoitmentService);
  responseTrackerService = inject(ResponseTrackerService);
  /*
   * computed signals
   */
  appointmentsAtCurrentDate: Signal<Appointment[]> = computed(() =>
    this.appointmentService
      .getAppointments()
      .filter((appointment: Appointment) => {
        const date = appointment.date as Date;
        const selectedDate = this.appointmentService.getSelectedDate();
        return (
          date.getMonth() === selectedDate.getMonth() &&
          date.getDate() === selectedDate.getDate()
        );
      }),
  );
  getSelectedDateTime: Signal<string> = computed(() =>
    this.getTime(this.appointmentService.getSelectedDate()),
  );
  currentRole: Signal<string> = computed(
    () => this.authenticationService.getAuthenticationState().role,
  );
  isResponseLoading: Signal<boolean> = computed(
    () => this.responseTrackerService.getState().isLoading,
  );
  onEditAppointment: Signal<Appointment | null> = computed(() =>
    this.appointmentService.getOnEditAppointment(),
  );
  getLongSelectedDate: Signal<string> = computed(() => {
    const date = this.appointmentService.getSelectedDate();
    return this.getLongDate(date.getDate(), date.getMonth());
  });
  selectedAppointmentBox: WritableSignal<number> = signal(-1);
  /*
   * own functions
   */
  getLongDate(day: number, month: number): string {
    return `${day} de ${MONTH_NAMES[month]}`;
  }
  getTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  updateHourBy(number: number) {
    this.appointmentService.updateHour(number);
  }
  setAppointmentIsOnline(isOnline: boolean) {
    this.isNewAppointmentOnline.set(isOnline);
  }
  saveAppointment() {
    this.appointmentService.saveAppointment(this.isNewAppointmentOnline());
  }
  selectAppointmentBoxIndex(newIndex: number) {
    this.selectedAppointmentBox.set(newIndex);
  }
  setOnEditAppointment() {
    const index = this.selectedAppointmentBox();
    const appointment = this.appointmentsAtCurrentDate()[index];
    this.appointmentService.setOnEditAppointment(appointment);
    this.isNewAppointmentOnline.set(appointment.isOnline);
  }
  setIsNewAppointment(isNew: boolean) {
    this.isNewAppointment.set(isNew);
  }
  isDateTaken() {
    const current = this.appointmentService.getSelectedDate().getTime();
    let match = false;
    this.appointmentsAtCurrentDate().forEach((appointment: Appointment) => {
      if ((appointment.date as Date).getTime() === current) {
        match = true;
      }
    });
    return match;
  }
  resetSidePanel() {
    this.appointmentService.setOnEditAppointment(null);
    this.setIsNewAppointment(false);
    this.selectAppointmentBoxIndex(-1);
  }
}
