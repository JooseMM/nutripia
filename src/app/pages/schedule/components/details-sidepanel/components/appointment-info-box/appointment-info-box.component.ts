import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { MONTH_NAMES } from 'src/app/constants/app-constants';
import Appointment from 'src/models/IAppointment';

@Component({
  selector: 'nt-appointment-info-box',
  imports: [NgClass],
  templateUrl: './appointment-info-box.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentInfoBoxComponent {
  /*
   * input fields
   */
  longDate = input<string>();
  time = input<string>();
  isOnline = input<boolean>();
  appointment = input<Appointment | null>(null);
  class = input<string>();
  isBoxSelected = input<boolean>();
  isBeingEdited = computed(
    () => this.appointment !== null && this.longDate() && this.time(),
  );
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
