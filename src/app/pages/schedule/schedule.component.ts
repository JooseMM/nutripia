import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CalendarComponent } from '../calendar/calendar.component';
import { DetailsSidepanelComponent } from './components/details-sidepanel/details-sidepanel.component';

@Component({
  selector: 'nt-schedule',
  imports: [CalendarComponent, DetailsSidepanelComponent],
  templateUrl: './schedule.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleComponent {}
