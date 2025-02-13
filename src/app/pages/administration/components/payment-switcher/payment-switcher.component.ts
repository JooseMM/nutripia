import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  InputSignal,
  Signal,
} from '@angular/core';
import { UserAdministrationService } from '../user-administration/services/user-administration.service';

@Component({
  selector: 'nt-payment-switcher',
  imports: [NgClass],
  templateUrl: './payment-switcher.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentSwitcherComponent {
  userId: InputSignal<string> = input.required<string>();
  userService = inject(UserAdministrationService);
  userPaid: Signal<boolean> = computed(
    () => this.userService.getUserById(this.userId())!.hasPaid,
  );
  toggleHadPaid() {
    this.userService.updateUserPaymentState(this.userId());
  }
}
