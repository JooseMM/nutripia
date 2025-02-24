import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  InputSignal,
  Signal,
} from '@angular/core';
import { getHoursToString, MONTH_NAMES } from 'src/app/constants/app-constants';
import { AppoitmentService } from 'src/app/shared/services/appoitments/appoitments.service';
import { AuthenticationService } from 'src/app/shared/services/authentication/authentication.service';
import Appointment from 'src/models/IAppointment';

@Component({
  selector: 'nt-appointment-info-box',
  imports: [],
  templateUrl: './appointment-info-box.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentInfoBoxComponent {
  authService = inject(AuthenticationService);
  appointmentService = inject(AppoitmentService);
  id: InputSignal<string> = input.required<string>();
  appointmentArry: Signal<Appointment[]> = computed(() =>
    this.appointmentService.getAppointments(),
  );
  appointment: Signal<Appointment> = computed(
    () => this.appointmentArry().find((item) => item.id === this.id())!,
  );
  constructor() {
    effect(() => {
      console.log('change');
      console.log(this.appointmentArry());
    });
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
}
