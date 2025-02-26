import { Component, effect, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthenticationService } from '../../shared/services/authentication/authentication.service';
import { Router } from '@angular/router';
import { ButtonComponent } from 'src/app/shared/button/button.component';
import { CustomInputComponent } from '../../shared/custom-input/custom-input.component';
import {
  registerBusinessLogicValidators,
  validationError,
} from './businessLogic';
import { newUserObjectAdapter } from '../login/adapter/newUserObjectAdapter';
import { finalize } from 'rxjs';
import ApiResponse from 'src/models/IApiResponse';
import NewClient from 'src/models/INewClient';

@Component({
  selector: 'nt-register',
  imports: [ReactiveFormsModule, ButtonComponent, CustomInputComponent],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  router = inject(Router);
  httpResponseIsLoading = signal(false);
  form: FormGroup = new FormGroup({
    fullName: new FormControl('', [
      ...registerBusinessLogicValidators.fullName,
    ]),
    email: new FormControl('', [...registerBusinessLogicValidators.email]),
    rut: new FormControl('', [...registerBusinessLogicValidators.rut]),
    passwordGroup: new FormGroup(
      {
        password: new FormControl('', [
          ...registerBusinessLogicValidators.password,
        ]),
        passwordConfirm: new FormControl('', Validators.required),
      },
      [...registerBusinessLogicValidators.passwordConfirm],
    ),
    yearOfBirth: new FormControl(new Date().getFullYear(), [
      ...registerBusinessLogicValidators.yearOfBirth,
    ]),
    phoneNumber: new FormControl('', [
      ...registerBusinessLogicValidators.phoneNumber,
    ]),
    previousDiagnostic: new FormControl('', [
      ...registerBusinessLogicValidators.previousDiagnostic,
    ]),
    goal: new FormControl('', [...registerBusinessLogicValidators.goal]),
  });
  //injects the service
  private authenticationService = inject(AuthenticationService);
  // listen to changes in the api connection state
  validationErrorObject = validationError;

  onSubmit() {
    this.httpResponseIsLoading.set(true);
    const newUserData: NewClient = newUserObjectAdapter(this.form.value);
    this.authenticationService
      .register(newUserData)
      .pipe(finalize(() => this.httpResponseIsLoading.set(false)))
      .subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.router.navigate(['/pre-confirmacion']);
          }
        },
        error: (rawResponse) => {
          const response = rawResponse.error as ApiResponse;
          switch (response.statusCode) {
            case 409: // Conflict status code, the email already exists in db
              // insert the validator error for the control to show
              this.form.get('email')?.setErrors({ emailAlreadyExists: true });
              break;
            case 400:
              // inserts a validator error for the control to show
              this.form
                .get('passwordGroup')
                ?.get('password')!
                .setErrors({ pattern: true });
              break;
            default: // Bad Request and Internal server error status code
              // insert the object error for the control to show
              // TODO: add all other feedback for the api response
              break;
          }
        },
      });
  }

  isInputInvalid(inputName: string): boolean {
    return (
      this.form.get(inputName)!.invalid && this.form.get(inputName)!.touched
    );
  }
  isInputPasswordValid() {
    return !(
      this.form.get('passwordGroup')!.get('password')!.invalid &&
      this.form.get('passwordGroup')!.get('password')!.touched
    );
  }
  doPasswordMatch() {
    return !(
      this.form.get('passwordGroup')!.get('passwordConfirm')!.touched &&
      this.form.get('passwordGroup')!.hasError('notMatchingPassword')
    );
  }
  getFormControl(controlName: string): FormControl {
    return this.form.get(controlName) as FormControl;
  }
  getPasswordNestedControl(controlName: string): FormControl {
    return this.getFormControl('passwordGroup').get(controlName) as FormControl;
  }
}
