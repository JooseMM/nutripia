import { Component, computed, inject, Signal } from '@angular/core';
import { LogoComponent } from '../../shared/logo/logo.component';
import { DecorativeIconComponent } from '../../shared/decorative-icon/decorative-icon.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthenticationService } from '../login/services/authentication.service';
import AuthenticationState from 'src/models/IAuthenticationState';
import ApiConnectionState from 'src/models/IApiCallState';
import { Router } from '@angular/router';
import { ButtonComponent } from 'src/app/shared/button/button.component';
import {
  chileanPhoneFormat,
  humanValidAge,
  letterAndSpacesPattern,
  letterSpaceAndSymbols,
  letterSpaceSymbolsAndNumbers,
} from 'src/app/constants/app-constants';
import { CustomInputComponent } from '../../shared/custom-input/custom-input.component';

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
      Validators.required,
      Validators.pattern(letterAndSpacesPattern),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(letterSpaceSymbolsAndNumbers),
    ]),
    confirmedPassword: new FormControl('', [
      Validators.required,
      Validators.pattern(letterSpaceSymbolsAndNumbers),
    ]),
    age: new FormControl(0, [
      Validators.required,
      Validators.pattern(humanValidAge),
    ]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(chileanPhoneFormat),
    ]), // TODO: add validators to let only phone numbers
    previousDiagnostics: new FormControl('', [
      Validators.required,
      Validators.pattern(letterSpaceAndSymbols),
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
    // call the service to update its state
    //TODO: this.authService.register(credentials);
    // pass the state to the isForbidden variable
  }

  isInputInvalid(inputName: string): boolean {
    return (
      this.reactiveForm.get(inputName)!.invalid &&
      this.reactiveForm.get(inputName)!.touched
    );
  }
  getFormControlName(controlName: string): FormControl {
    return this.reactiveForm.get(controlName) as FormControl;
  }
}
