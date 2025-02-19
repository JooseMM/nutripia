import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PRIMARY_HEX } from 'src/app/constants/app-constants';

@Component({
  selector: 'nt-schedule-sidebar-icon',
  imports: [],
  templateUrl: './schedule-sidebar-icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleSidebarIconComponent {
  isDarkThemeOn = input<boolean>(false);
  darkColor = PRIMARY_HEX;
}
