import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  registerBusinessLogicValidators,
  validationError,
} from 'src/app/pages/register/businessLogic';
import { ButtonComponent } from 'src/app/shared/button/button.component';
import { CustomInputComponent } from 'src/app/shared/custom-input/custom-input.component';
import { UserAdministrationService } from '../services/user-administration.service';
import User from 'src/models/IUser';

@Component({
  selector: 'nt-user-editing-form',
  imports: [ButtonComponent, CustomInputComponent, ReactiveFormsModule],
  templateUrl: './user-editing-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEditingFormComponent {
  userAdminService = inject(UserAdministrationService);
  userToEdit: Signal<User | undefined> = computed(() =>
    this.userAdminService
      .getAllUsers()
      .find(
        (user: User) => user.id === this.userAdminService.getOnEditingUserId(),
      ),
  );
  form: FormGroup = new FormGroup({
    fullName: new FormControl(this.userToEdit()?.fullName, [
      ...registerBusinessLogicValidators.fullName,
    ]),
    email: new FormControl(this.userToEdit()?.email, [
      ...registerBusinessLogicValidators.email,
    ]),
    rut: new FormControl(this.userToEdit()?.rut, [
      ...registerBusinessLogicValidators.rut,
    ]),
    yearOfBirth: new FormControl(this.userToEdit()?.yearOfBirth, [
      ...registerBusinessLogicValidators.yearOfBirth,
    ]),
    phoneNumber: new FormControl(this.userToEdit()?.phoneNumber, [
      ...registerBusinessLogicValidators.phoneNumber,
    ]),
    previousDiagnostics: new FormControl(
      this.userToEdit()?.previousDiagnostics,
      [...registerBusinessLogicValidators.previousDiagnostics],
    ),
    goals: new FormControl(this.userToEdit()?.goals, [
      ...registerBusinessLogicValidators.goals,
    ]),
  });
  validationErrorObject = validationError;
  getFormControl(controlName: string): FormControl {
    return this.form.get(controlName) as FormControl;
  }
  onSubmit() {
    const newUserDate: User = { ...this.userToEdit()!, ...this.form.value };
    this.userAdminService.updateUser(newUserDate);
  }
  httpResponseIsLoading() {
    return false;
  }
  stopEditing() {
    this.userAdminService.setOnEditingUserId(null);
  }
}
