import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  Signal,
  signal,
} from '@angular/core';
import { PaymentSwitcherComponent } from '../../payment-switcher/payment-switcher.component';
import { UserAdministrationService } from '../services/user-administration.service';
import User from 'src/models/IUser';
import { ButtonComponent } from '../../../../../shared/button/button.component';

@Component({
  selector: 'nt-user-box',
  imports: [NgClass, PaymentSwitcherComponent, ButtonComponent],
  templateUrl: './user-box.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBoxComponent {
  userId = input.required<string>();
  userService = inject(UserAdministrationService);
  user: Signal<User | undefined> = computed(() =>
    this.userService
      .getAllUsers()
      .find((user: User) => user.id === this.userId()),
  );
  isBoxOpen = signal(false);

  toggleExpandableBox() {
    this.isBoxOpen.update((prev) => !prev);
  }
  startEditing(newUserId: string): void {
    this.userService.setOnEditingUserId(newUserId);
  }
  getStyles() {
    return {
      'bg-primary-purple border-charcoal': this.user()!.hasPaid,
      'border-red-dark bg-red': !this.user()!.hasPaid,
      'h-20 py-[0.75rem] px-6': !this.isBoxOpen(),
      'h-auto flex-col px-5 pt-1 pb-5 | lg:block': this.isBoxOpen(),
    };
  }
  getUserAge() {
    const currentDate = new Date().getFullYear();
    return currentDate - this.user()!.yearOfBirth;
  }
}
