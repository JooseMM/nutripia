import { Component } from '@angular/core';
import { CalendarComponent } from './components/calendar/calendar.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'nt-schedule-page',
  imports: [CalendarComponent, NgClass],
  templateUrl: './schedule.page.html',
})
export class SchedulePage {
  //TODO: for testing purporses only
  protected isAppointmentOnline = false;
  selectedClass = 'p-2.5 bg-primary-purple rounded-full';
  notSelectedClass = 'p-2.5 bg-white rounded-full';

  appointmentIsOnline() {
    this.isAppointmentOnline = true;
  }
  appointmentIsNotOnline() {
    this.isAppointmentOnline = false;
  }
}
