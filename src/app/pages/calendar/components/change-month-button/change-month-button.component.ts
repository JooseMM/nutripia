import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'nt-change-month-button',
  imports: [NgClass],
  templateUrl: './change-month-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeMonthButtonComponent {
  class = input<string>();
}
