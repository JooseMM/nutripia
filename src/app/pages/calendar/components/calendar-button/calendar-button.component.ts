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
    'h-[70px] w-full pt-1 text-lg font-normal rounded-lg flex justify-start flex justify-center items-start | lg:font-normal lg:text-xl lg:rounded-none lg:px-2 lg:py-1 lg:hover:cursor-pointer lg:items-end lg:justify-end lg:text-right';
  takenSyles = `${this.baseStyles} bg-primary-purple text-white border-2 border-charcoal`;
  normalStyles = `${this.baseStyles} bg-white text-primary-purple outline outline-1 outline-lavender-gray`;
  selectedStyles = `${this.baseStyles} bg-white text-primary-purple outline outline-1 outline-lavender-gray ring ring-inset ring-lavender-gray`;
  disableStyles = `${this.baseStyles} text-primary-purple outline outline-1 outline-lavender-gray | lg:hover:cursor-default `;
}
