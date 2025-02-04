import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { LogoComponent } from '../../shared/logo/logo.component';
import { DecorativeIconComponent } from '../../shared/decorative-icon/decorative-icon.component';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthenticationService } from '../login/services/authentication.service';
import AuthenticationState from 'src/models/IAuthenticationState';
import ApiConnectionState from 'src/models/IApiCallState';
import { Router } from '@angular/router';
import { ButtonComponent } from 'src/app/shared/button/button.component';
import {
  letterAndSpacesPattern,
  letterSpaceAndSymbols,
  letterSpaceSymbolsAndNumbers,
} from 'src/app/constants/app-constants';
import { CustomInputComponent } from '../../shared/custom-input/custom-input.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { max } from 'rxjs';
import { registerBusinessLogicValidators } from './businessLogic';

@Component({
  selector: 'nt-register',
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    LogoComponent,
    DecorativeIconComponent,
    CustomInputComponent,
  ],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  router = inject(Router);
  reactiveForm: FormGroup = new FormGroup({
    fullName: new FormControl('', [
      ...registerBusinessLogicValidators.fullName,
    ]),
    email: new FormControl('', [...registerBusinessLogicValidators.email]),
    passwordGroup: new FormGroup(
      {
        password: new FormControl('', [
          ...registerBusinessLogicValidators.password,
        ]),
        passwordConfirm: new FormControl('', Validators.required),
      },
      [...registerBusinessLogicValidators.passwordConfirm],
    ),
    age: new FormControl(0, [...registerBusinessLogicValidators.age]),
    phoneNumber: new FormControl('', [
      ...registerBusinessLogicValidators.phoneNumber,
    ]),
    previousDiagnostics: new FormControl('', [
      ...registerBusinessLogicValidators.previousDiagnostics,
    ]),
  });
  //injects the service
  private authService = inject(AuthenticationService);
  // listen to changes in the api connection state
  protected apiConnectionState: Signal<ApiConnectionState> = computed(() =>
    this.authService.getApiConnectionState(),
  );

  onSubmit() {
    this.router.navigate(['/']);
    //TODO: this.authService.register(credentials);
  }

  isInputInvalid(inputName: string): boolean {
    return (
      this.reactiveForm.get(inputName)!.invalid &&
      this.reactiveForm.get(inputName)!.touched
    );
  }
  isInputPasswordValid() {
    return !(
      this.reactiveForm.get('passwordGroup')!.get('password')!.invalid &&
      this.reactiveForm.get('passwordGroup')!.get('password')!.touched
    );
  }
  doPasswordMatch() {
    return !(
      this.reactiveForm.get('passwordGroup')!.get('passwordConfirm')!.touched &&
      this.reactiveForm.get('passwordGroup')!.hasError('notMatchingPassword')
    );
  }
  getFormControl(controlName: string): FormControl {
    return this.reactiveForm.get(controlName) as FormControl;
  }
  getPasswordNestedControl(controlName: string): FormControl {
    return this.getFormControl('passwordGroup').get(controlName) as FormControl;
  }
}
