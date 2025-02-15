import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import DayObject from 'src/app/shared/services/appoitments/IDayObject';

@Component({
  selector: 'nt-calendar-button',
  imports: [NgClass],
  templateUrl: './calendar-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarButtonComponent {
  day = input.required<DayObject>();
  takenSyles = 'bg-primary-purple text-white border-2 border-charcoal';
  selectedStyles =
    'bg-white text-primary-purple relative z-10 | static outline outline-1 outline-lavender-gray sm:ring sm:ring-inset sm:ring-lavender-gray';
  disableStyles =
    'text-primary-purple | sm:outline sm:outline-1 sm:outline-lavender-gray sm:hover:cursor-default ';
}
