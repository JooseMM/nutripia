import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Signal,
} from '@angular/core';
import {
  SINGLE_LETTER_WEEK_DAY,
  THREE_LETTER_WEEKDAY,
} from 'src/app/constants/app-constants';
import { AppoitmentService } from 'src/app/shared/services/appoitments/appoitments.service';
import DayObject from 'src/app/shared/services/appoitments/IDayObject';
import { NgClass } from '@angular/common';
@Component({
  selector: 'nt-calendar',
  imports: [NgClass],
  templateUrl: './calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {
  appointmentService = inject(AppoitmentService);
  threeLetterWeekDay = THREE_LETTER_WEEKDAY;
  singleLetterWeekDay = SINGLE_LETTER_WEEK_DAY;
  daysOfTheMonth: Signal<DayObject[]> = computed(() =>
    this.appointmentService.getDaysOfTheMonth(),
  );
  selectedDay: Signal<Date> = computed(() =>
    this.appointmentService.getSelectedDate(),
  );
  getMonthName: Signal<string> = computed(() =>
    this.appointmentService.getMonthNameOf(this.selectedDay().getMonth()),
  );
  updateMonth(updateBy: number) {
    this.appointmentService.updateMonth(updateBy);
  }
  getBoxDayClass(index: number, day: DayObject, length: number) {
    switch (true) {
      case day.appointments.length > 0 && day.isSelected: // box with appointments
        return 'bg-primary-purple text-white opacity-80 ring ring-inset ring-4 ring-[#6C6180]';
      case day.appointments.length > 0: // box with appointments
        return 'bg-primary-purple text-white ring ring-inset ring-4 ring-[#6C6180]';
      case day.isSelected: // selected box
        return 'ring ring-inset ring-2 ring-lavender-gray ';
      case index === length - 1: // last box have no border
        return 'border-none';
      case index > length - 8 && index < length - 1: // last 6 boxes not counting the very last
        return 'border-r';
      case index < 6: // first boxes
        return 'border-r border-b';
      case [6, 13, 20, 27, 34, 41].includes(index): // last column only
        return 'border-b';
      default:
        return 'border-r border-b';
    }
  }
  newDaySelected(day: number) {
    this.appointmentService.updateSelectedDay(day);
  }
}
