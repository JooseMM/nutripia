import { Component } from '@angular/core';
import { CalendarComponent } from './components/calendar/calendar.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'nt-schedule-page',
  imports: [CalendarComponent],
  templateUrl: './schedule.page.html',
})
export class SchedulePage {
  //TODO: for testing purporses only
}
