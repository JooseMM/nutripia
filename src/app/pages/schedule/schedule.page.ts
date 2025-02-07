import { Component } from '@angular/core';
import { CalendarComponent } from './components/calendar/calendar.component';

@Component({
  selector: 'nt-schedule-page',
  imports: [CalendarComponent],
  templateUrl: './schedule.page.html',
})
export class SchedulePage {}
