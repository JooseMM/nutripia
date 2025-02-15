import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  MONTH_NAMES,
  WORK_END_HOUR,
  WORK_START_HOUR,
} from 'src/app/constants/app-constants';
import { ButtonComponent } from '../../shared/button/button.component';
import { CalendarComponent } from '../calendar/calendar.component';
import { AppoitmentService } from 'src/app/shared/services/appoitments/appoitments.service';

@Component({
  selector: 'nt-schedule',
  imports: [CalendarComponent, NgClass, ButtonComponent],
  templateUrl: './schedule.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleComponent {
  appointmentService = inject(AppoitmentService);
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
  isAppointmentOnline: WritableSignal<boolean> = signal(false);
  notSelectedClass = 'p-2.5 bg-white rounded-full';
  selectedClass = 'p-2.5 bg-primary-purple rounded-full';

  setAppointmentIsOnline(isOnline: boolean) {
    this.isAppointmentOnline.set(isOnline);
  }
  updateHourBy(number: number) {
    this.updateHourBy(number);
  }
  saveAppointment() {}
}
