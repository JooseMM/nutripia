import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import User from 'src/models/IUser';
import { UserBoxComponent } from './user-box/user-box.component';
import { NgClass } from '@angular/common';
import { CustomInputComponent } from '../../../../shared/custom-input/custom-input.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  registerBusinessLogicValidators,
  validationError,
} from 'src/app/pages/register/businessLogic';
import { ButtonComponent } from 'src/app/shared/button/button.component';

@Component({
  selector: 'nt-user-administration',
  imports: [
    UserBoxComponent,
    NgClass,
    ButtonComponent,
    CustomInputComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './user-administration.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAdministrationComponent {
  isEditing = signal(true);
  form: FormGroup = new FormGroup({
    fullName: new FormControl('', [
      ...registerBusinessLogicValidators.fullName,
    ]),
    email: new FormControl('', [...registerBusinessLogicValidators.email]),
    rut: new FormControl('', [...registerBusinessLogicValidators.rut]),
    yearOfBirth: new FormControl(new Date().getFullYear(), [
      ...registerBusinessLogicValidators.yearOfBirth,
    ]),
    phoneNumber: new FormControl('', [
      ...registerBusinessLogicValidators.phoneNumber,
    ]),
    previousDiagnostics: new FormControl('', [
      ...registerBusinessLogicValidators.previousDiagnostics,
    ]),
    goals: new FormControl('', [
      ...registerBusinessLogicValidators.previousDiagnostics,
    ]),
  });
  userList: User[] = [
    {
      id: '1234',
      fullName: 'Jose Moreno',
      age: 26,
      role: 'client_user',
      rut: '26.701.979-7',
      email: 'josexmoreno1998@gmail.com',
      previousDiagnostics: '',
      phoneNumber: '9 3284 2343',
      yearOfBirth: 1998,
      hasPaid: true,
      goals: 'Mejorar condicion fisica y mental',
    },
    {
      id: '1234',
      fullName: 'Jose Moreno',
      age: 26,
      role: 'client_user',
      rut: '26.701.979-7',
      email: 'josexmoreno1998@gmail.com',
      previousDiagnostics: '',
      phoneNumber: '9 3284 2343',
      yearOfBirth: 1998,
      hasPaid: true,
      goals: 'Mejorar condicion fisica y mental',
    },
    {
      id: '234',
      fullName: 'Jose Moreno',
      age: 26,
      role: 'client_user',
      rut: '26.721.979-7',
      email: 'josexmoreno1998@gmail.com',
      previousDiagnostics: '',
      phoneNumber: '9 3284 2343',
      yearOfBirth: 1998,
      hasPaid: false,
      goals: 'Ganar masa muscular',
    },
    {
      id: '124',
      fullName: 'Jose Mijares',
      age: 26,
      role: 'client_user',
      rut: '26.721.979-7',
      email: 'josexmoreno1998@gmail.com',
      previousDiagnostics: '',
      phoneNumber: '9 3284 2343',
      yearOfBirth: 1998,
      hasPaid: false,
      goals: 'Ganar masa muscular',
    },
  ];
  validationErrorObject = validationError;
  setIsEditing(newState: boolean) {
    this.isEditing.set(newState);
  }
  getFormControl(controlName: string): FormControl {
    return this.form.get(controlName) as FormControl;
  }
  onSubmit() {
    console.log(this.form.value);
  }
  httpResponseIsLoading() {
    return false;
  }
}
