import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Signal,
  signal,
} from '@angular/core';
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
import { UserAdministrationService } from './services/user-administration.service';

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
  providers: [UserAdministrationService],
})
export class UserAdministrationComponent {
  userAdminService = inject(UserAdministrationService);
  isEditing = computed(() => this.userAdminService.getOnEditingUserId());
  validationErrorObject = validationError;
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
  userIdList: Signal<string[]> = computed(() =>
    this.userAdminService.getAllUsersId(),
  );
  stopEditing() {
    this.userAdminService.setOnEditingUserId(null);
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
