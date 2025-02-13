import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import User from 'src/models/IUser';

@Component({
  selector: 'nt-user-box',
  imports: [NgClass],
  templateUrl: './user-box.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBoxComponent {
  user = input.required<User>();
  userPaidStyles = 'bg-primary-purple px-4 text-white';
  userNotPaidStyles = '';
}
