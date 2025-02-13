import { ChangeDetectionStrategy, Component } from '@angular/core';
import User from 'src/models/IUser';
import { UserBoxComponent } from './user-box/user-box.component';

@Component({
  selector: 'nt-user-list',
  imports: [UserBoxComponent],
  templateUrl: './user-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {
  userList: User[] = [
    {
      id: '1234',
      fullName: 'Jose Moreno',
      age: 26,
      role: 'client_user',
      rut: '267019797-7',
      email: 'josexmoreno1998@gmail.com',
      previousDiagnostics: '',
      phoneNumber: '9 3284 2343',
      yearOfBirth: 1998,
      hasPaid: true,
      goals: 'Ganar masa muscular',
    },
    {
      id: '1234',
      fullName: 'Jose Moreno',
      age: 26,
      role: 'client_user',
      rut: '267019797-7',
      email: 'josexmoreno1998@gmail.com',
      previousDiagnostics: '',
      phoneNumber: '9 3284 2343',
      yearOfBirth: 1998,
      hasPaid: true,
      goals: 'Ganar masa muscular',
    },
  ];
}
