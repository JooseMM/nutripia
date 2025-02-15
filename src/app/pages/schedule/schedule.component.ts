import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  EventEmitter,
  inject,
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
import { AppoitmentsService } from 'src/app/shared/services/appoitments/appoitments.service';

@Component({
  selector: 'nt-schedule',
  imports: [CalendarComponent, NgClass, ButtonComponent],
  templateUrl: './schedule.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleComponent {
  appointmentService = inject(AppoitmentsService);
  selectedDate: WritableSignal<Date> = signal(
    this.appointmentService.getCurrentDate(),
  );
  isAppointmentOnline: WritableSignal<boolean> = signal(false);
  notSelectedClass = 'p-2.5 bg-white rounded-full';
  selectedClass = 'p-2.5 bg-primary-purple rounded-full';
  notAvailableDates: number[] = [14, 10]; // TODO: get this from a service

  constructor() {
    effect(() => console.log(this.selectedDate()));
  }
  setAppointmentIsOnline(isOnline: boolean) {
    this.isAppointmentOnline.set(isOnline);
  }
  updateHour(updateBy: number) {
    const currentHours = this.selectedDate().getHours() + updateBy;
    // Date handles hours to wrap around 24, business logic tell us to only have available hours from 9hrs to 20hrs
    const validOperation =
      currentHours <= WORK_END_HOUR && currentHours >= WORK_START_HOUR;
    if (validOperation) {
      this.selectedDate.update((prev) => {
        return new Date(
          prev.getFullYear(),
          prev.getMonth(),
          prev.getDate(),
          currentHours,
          0,
          0,
          0,
        );
      });
    }
  }
  saveAppointment(): void {
    // TODO: check the validity of the input to save
    if (this.notAvailableDates.includes(this.selectedDate().getDate())) {
      console.log('Dia seleccionado no disponible');
    } else {
      console.log('Selected day:');
      console.log(this.selectedDate());
      console.log('is online:');
      console.log(this.isAppointmentOnline());
    }
  }
  dateDidChange(newDate: Date) {
    this.selectedDate.set(newDate);
  }
  getMonthName() {
    return MONTH_NAMES[this.selectedDate().getMonth()];
  }
}
