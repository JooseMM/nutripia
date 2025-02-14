import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Signal,
} from '@angular/core';
import { UserBoxComponent } from './user-box/user-box.component';
import { NgClass } from '@angular/common';
import { UserAdministrationService } from './services/user-administration.service';
import { UserEditingFormComponent } from './user-editing-form/user-editing-form.component';

@Component({
  selector: 'nt-user-administration',
  imports: [UserBoxComponent, NgClass, UserEditingFormComponent],
  templateUrl: './user-administration.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAdministrationComponent {
  userAdminService = inject(UserAdministrationService);
  isEditing = computed(() => this.userAdminService.getOnEditingUserId());
  userIdList: Signal<string[]> = computed(() =>
    this.userAdminService.getAllUsersId(),
  );
}
