import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  signal,
  WritableSignal,
} from '@angular/core';

@Component({
  selector: 'nt-payment-switcher',
  imports: [NgClass],
  templateUrl: './payment-switcher.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentSwitcherComponent {
  hadPaid: WritableSignal<boolean> = signal(true);

  toggleHadPaid() {
    this.hadPaid.update((prev) => !prev);
  }
}
