import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  Signal,
} from '@angular/core';
import { UserBoxComponent } from './user-box/user-box.component';
import { UserAdministrationService } from './services/user-administration.service';
import { UserEditingFormComponent } from './user-editing-form/user-editing-form.component';
import User from 'src/models/IUser';

@Component({
  selector: 'nt-user-administration',
  imports: [UserBoxComponent, UserEditingFormComponent],
  templateUrl: './user-administration.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAdministrationComponent implements OnInit {
  userAdminService = inject(UserAdministrationService);
  isEditing = computed(() => this.userAdminService.getUserBeingEdited());
  userList: Signal<User[]> = computed(() =>
    this.userAdminService.getAllUsers(),
  );

  ngOnInit() {
    this.userAdminService.refreshUserArray();
  }
}
