import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { CalendarComponent } from '../calendar/calendar.component';
import { DetailsSidepanelComponent } from './components/details-sidepanel/details-sidepanel.component';
import { AppoitmentService } from 'src/app/shared/services/appoitments/appoitments.service';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'nt-schedule',
  imports: [CalendarComponent, DetailsSidepanelComponent],
  templateUrl: './schedule.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleComponent {
  appointmentService = inject(AppoitmentService);
  router = inject(Router);
  scrollApi = inject(ViewportScroller);
  constructor() {
    effect(() => {
      const shouldScroll = this.appointmentService.getScrollTrigger();
      if (shouldScroll) {
        this.scrollApi.scrollToAnchor('sidePanel');
        this.appointmentService.toggleScrollTrigger();
      }
    });
  }
}
