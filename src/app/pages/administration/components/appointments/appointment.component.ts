import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CalendarComponent } from 'src/app/pages/calendar/calendar.component';

@Component({
  selector: 'nt-appointment-list',
  imports: [CalendarComponent],
  templateUrl: './appointment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentsComponent {}
