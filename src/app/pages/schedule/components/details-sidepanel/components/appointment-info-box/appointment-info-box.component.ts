import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  inject,
  input,
  InputSignal,
  Signal,
} from '@angular/core';
import {
  ADMIN_ROLE,
  getHoursToString,
  MONTH_NAMES,
} from 'src/app/constants/app-constants';
import { AppoitmentService } from 'src/app/shared/services/appoitments/appoitments.service';
import { AuthenticationService } from 'src/app/shared/services/authentication/authentication.service';
import Appointment from 'src/models/IAppointment';
import AuthenticationState from 'src/models/IAuthenticationState';

@Component({
  selector: 'nt-appointment-info-box',
  imports: [],
  templateUrl: './appointment-info-box.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentInfoBoxComponent {
  authService = inject(AuthenticationService);
  appointmentService = inject(AppoitmentService);
  changeDetectionRef = inject(ChangeDetectorRef);
  selectedDate = computed(() => this.appointmentService.getSelectedDate());
  newDate: Signal<Date> = computed(() =>
    this.appointmentService.getSelectedDate(),
  );
  appointment: InputSignal<Appointment> = input.required<Appointment>();
  constructor() {
    effect(() => {
      if (this.appointmentService.getAppointments()) {
        this.changeDetectionRef.markForCheck();
        /*
         * mark the components as dirty to force an update of its values
         */
      }
    });
  }
  getOwnerName(appointment: Appointment): string {
    return appointment.ownerName!;
  }
  getDate(date: Date): string {
    return `${date.getDate()} de ${MONTH_NAMES[date.getMonth()]}`;
  }
  getHours(date: Date): string {
    return getHoursToString(date);
  }
  getIconSource(isOnline: boolean): string {
    const basePath = 'assets/icons';
    return isOnline ? `${basePath}/` : `${basePath}`;
  }
  isUserAllowToSee(userInfo: AuthenticationState): boolean {
    if (this.appointment().userId === userInfo.id) {
      return true;
    } else if (this.isUserAdmin()) {
      return true;
    } else {
      return false;
    }
  }
  isDateAvailable(): boolean {
    return this.appointmentService.isDateAndTimeNotTaken();
  }
  isUserAdmin() {
    const userInfo = this.authService.getAuthenticationState();
    return userInfo.role === ADMIN_ROLE;
  }
}
