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
import { CalendarButtonComponent } from './components/calendar-button/calendar-button.component';
import { AppoitmentService } from 'src/app/shared/services/appoitments/appoitments.service';
import DayObject from 'src/app/shared/services/appoitments/IDayObject';
@Component({
  selector: 'nt-calendar',
  imports: [CalendarButtonComponent],
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
}
