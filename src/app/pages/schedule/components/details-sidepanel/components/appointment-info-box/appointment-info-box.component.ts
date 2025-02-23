import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { ADMIN_ROLE, MONTH_NAMES } from 'src/app/constants/app-constants';
import { AppoitmentService } from 'src/app/shared/services/appoitments/appoitments.service';
import { AuthenticationService } from 'src/app/shared/services/authentication/authentication.service';
import Appointment from 'src/models/IAppointment';

@Component({
  selector: 'nt-appointment-info-box',
  imports: [NgClass],
  templateUrl: './appointment-info-box.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentInfoBoxComponent {
  /*
   * dependencies
   */
  authService = inject(AuthenticationService);
  appointmentService = inject(AppoitmentService);
  /*
   * input fields
   */
  longDate = input<string>();
  time = input<string>();
  isOnline = input<boolean>();
  appointment = input<Appointment | null>(null);
  class = input<string>();
  isBoxSelected = input<boolean>();
  /*
   * signals
   */
  isBeingEdited = computed(
    () => this.appointment !== null && this.longDate() && this.time(),
  );
  currentUser = computed(() => this.authService.getAuthenticationState());
  /*
   * own functions
   */
  getAppointmentLongDate(): string | null {
    if (this.appointment() === null) {
      return null;
    }
    const date = this.appointment()?.date as Date;
    return `${date.getDate()} de ${MONTH_NAMES[date.getMonth()]}`;
  }
  isAppointmentOwnerOrAdmin() {
    const userRole = this.currentUser();
    const userIsOwner = this.appointment()?.userId === this.currentUser().id;
    return userRole || userIsOwner;
  }
  isUserAdmin() {
    return this.currentUser().role === ADMIN_ROLE;
  }
  isDateTaken() {
    const current = this.appointmentService.getSelectedDate().getTime();
    const appointmentList = this.appointmentService.getAppointments();
    let match = false;
    appointmentList.forEach((appointment: Appointment) => {
      if ((appointment.date as Date).getTime() === current) {
        match = true;
      }
    });
    return match;
  }
  getAppointmentTime(): string | null {
    if (this.appointment() === null) {
      return null;
    }
    const date = this.appointment()?.date as Date;
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
