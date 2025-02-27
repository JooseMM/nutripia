import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import Appointment from 'src/models/IAppointment';

type ButtonType = 'modify' | 'completed' | 'delete' | 'not-completed';
@Component({
  selector: 'nt-side-panel-buttons',
  imports: [NgClass],
  templateUrl: './side-panel-buttons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidePanelButtonsComponent {
  type = input.required<ButtonType>();
  appointment = input.required<Appointment>();
  getBackgroundStyle(type: ButtonType): string {
    switch (type) {
      case 'completed':
      case 'not-completed':
        return 'bg-primary-purple border-dark-slate-grape';
      case 'modify':
        return 'bg-white border-primary-purple';
      case 'delete':
        return 'bg-red border-red-dark';
    }
  }
  shouldDisable(type: ButtonType, appointment: Appointment): boolean {
    const isDeleteOrModifying = type === 'modify' || type === 'delete';
    return isDeleteOrModifying && appointment.isCompleted;
  }
}
