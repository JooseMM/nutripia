import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { PRIMARY_HEX } from 'src/app/constants/app-constants';
import { UserAdministrationService } from './components/user-administration/services/user-administration.service';
import { UserAdministrationComponent } from './components/user-administration/user-administration.component';
import User from 'src/models/IUser';
import { ScheduleComponent } from '../schedule/schedule.component';

@Component({
  selector: 'nt-administration',
  imports: [NgClass, UserAdministrationComponent, ScheduleComponent],
  templateUrl: './administration.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdministrationComponent {
  selectedStyles: string =
    'bg-primary-purple text-white border-b border-charcoal';
  inClientSection: WritableSignal<boolean> = signal(true);
  purple = PRIMARY_HEX;
  userAdminService = inject(UserAdministrationService);
  unsaveChanges: Signal<boolean> = computed(
    () =>
      !!this.userAdminService
        .getAllUsers()
        .find((user: User) => user.markedForChange),
  );

  setClientSection(inClient: boolean) {
    this.inClientSection.set(inClient);
  }
  saveChanges() {
    this.userAdminService.saveChanges();
  }
}
