import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { AppoitmentService } from 'src/app/shared/services/appoitments/appoitments.service';
import Appointment from 'src/models/IAppointment';

@Component({
  selector: 'nt-appointment-info-box',
  imports: [],
  templateUrl: './appointment-info-box.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentInfoBoxComponent {
  appointmentService = inject(AppoitmentService);
  isAppointmentOnline: WritableSignal<boolean> = signal(false);
  getTime: Signal<string> = computed(() =>
    this.appointmentService
      .getSelectedDate()
      .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  );
  getLongDate: Signal<string> = computed(() => {
    const selectedDay = this.appointmentService.getSelectedDate().getDate();
    const selectedMonth = this.appointmentService.getSelectedDate().getMonth();
    return (
      selectedDay +
      ' de ' +
      this.appointmentService.getMonthNameOf(selectedMonth)
    );
  });
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
