import { ChangeDetectionStrategy, Component } from '@angular/core';
import User from 'src/models/IClientUser';
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
      hasPaid: true,
      goals: 'Ganar masa muscular',
    },
    {
      id: '123',
      fullName: 'Kevin Contreras',
      age: 20,
      role: 'client_user',
      rut: '267019797-7',
      email: 'josexmoreno1998@gmail.com',
      previousDiagnostics: '',
      hasPaid: true,
      goals: 'Ganar masa muscular',
    },
  ];
}
