import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import User from 'src/models/IUser';
import { ButtonComponent } from '../../../../../shared/button/button.component';

@Component({
  selector: 'nt-user-box',
  imports: [NgClass, ButtonComponent],
  templateUrl: './user-box.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBoxComponent {
  user = input.required<User>();
  isOpen = signal(false);

  toggleExpandableBox() {
    this.isOpen.update((prev) => !prev);
  }
  editUser() {
    console.log('work');
  }
  getStyles() {
    return {
      'bg-primary-purple border-charcoal': this.user().hasPaid,
      'border-red-dark bg-red': !this.user().hasPaid,
      'h-auto p-6 lg:hover:opacity-100': this.isOpen(),
      'h-20 py-3 px-6': !this.isOpen(),
    };
  }
}
