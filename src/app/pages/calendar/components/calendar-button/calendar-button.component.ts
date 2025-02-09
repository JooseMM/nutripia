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
    'h-[70px] w-full pt-1 text-lg font-medium rounded-lg flex justify-start flex justify-center items-start lg:hover:cursor-pointer';
  takenSyles = `${this.baseStyles} bg-primary-purple text-white border border-charcoal`;
  normalStyles = `${this.baseStyles} bg-white text-primary-purple`;
  selectedStyles = `${this.baseStyles} bg-white border border-primary-purple text-primary-purple border border-charcoal`;
  disableStyles = `${this.baseStyles} text-primary-purple opacity-40 `;
}
