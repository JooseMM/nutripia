import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'nt-calendar-button',
  imports: [NgClass],
  templateUrl: './calendar-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarButtonComponent {
  day = input.required<number>();
  state = input();
  baseStyles =
    'h-[70px] w-full pt-1 text-lg font-normal rounded-lg flex justify-start flex justify-center items-start | sm:font-normal sm:text-xl sm:rounded-none sm:px-2 sm:py-1 sm:hover:cursor-pointer sm:items-end sm:justify-end sm:text-right';
  takenSyles = `${this.baseStyles} bg-primary-purple text-white border-2 border-charcoal`;
  normalStyles = `${this.baseStyles} bg-white text-primary-purple sm:outline sm:outline-1 sm:outline-lavender-gray`;
  selectedStyles = `${this.baseStyles} bg-white text-primary-purple relative z-10 | static outline outline-1 outline-lavender-gray sm:ring sm:ring-inset sm:ring-lavender-gray`;
  disableStyles = `${this.baseStyles} text-primary-purple | sm:outline sm:outline-1 sm:outline-lavender-gray sm:hover:cursor-default `;
}
