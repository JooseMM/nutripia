import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  signal,
  WritableSignal,
} from '@angular/core';
import { PRIMARY_HEX } from 'src/app/constants/app-constants';
import { UserAdministrationComponent } from './components/user-list/user-administration.component';

@Component({
  selector: 'nt-administration',
  imports: [NgClass, UserAdministrationComponent],
  templateUrl: './administration.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdministrationComponent {
  selectedStyles: string =
    'bg-primary-purple text-white border-b border-charcoal';
  inClientSection: WritableSignal<boolean> = signal(true);
  purple = PRIMARY_HEX;

  setClientSection(inClient: boolean) {
    this.inClientSection.set(inClient);
  }
}
