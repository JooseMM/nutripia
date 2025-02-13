import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  signal,
  WritableSignal,
} from '@angular/core';
import { PRIMARY_HEX } from 'src/app/constants/app-constants';
import { UserListComponent } from './components/user-list/user-list.component';

@Component({
  selector: 'nt-administration',
  imports: [NgClass, UserListComponent],
  templateUrl: './administration.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdministrationComponent {
  baseStyles: string =
    'flex justify-center space-x-5 py-4 w-full items-center text-2xl text-primary-purple border border-lavender-gray ';
  selectedStyles: string =
    'bg-primary-purple text-white border-b border-charcoal';
  inClientSection: WritableSignal<boolean> = signal(true);
  purple = PRIMARY_HEX;

  setClientSection(inClient: boolean) {
    this.inClientSection.set(inClient);
  }
}
