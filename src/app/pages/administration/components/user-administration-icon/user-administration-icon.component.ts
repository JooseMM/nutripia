import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PRIMARY_HEX } from 'src/app/constants/app-constants';

@Component({
  selector: 'nt-user-administration-icon',
  imports: [],
  templateUrl: './user-administration-icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAdministrationIconComponent {
  isDarkThemeOn = input<boolean>(false);
  darkColor = PRIMARY_HEX;
}
