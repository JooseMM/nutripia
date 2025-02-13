import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import User from 'src/models/IUser';

@Component({
  selector: 'nt-user-box',
  imports: [NgClass],
  templateUrl: './user-box.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBoxComponent {
  user = input.required<User>();
  isOpen = signal(false);
  isEditing = input.required<boolean>();
  isEditingChange = output<boolean>();

  toggleExpandableBox() {
    this.isOpen.update((prev) => !prev);
  }
  setIsEditing(newState: boolean) {
    this.isEditingChange.emit(newState);
  }
  getStyles() {
    return {
      ' bg-primary-purple border-charcoal': this.user().hasPaid,
      ' border-red-dark bg-red ': !this.user().hasPaid,
      ' h-20 py-[0.75rem] px-6 lg:hover:opacity-90 ': !this.isOpen(),
      ' h-auto px-5 pt-1 pb-5 lg:hover:opacity-100 ': this.isOpen(),
    };
  }
}
