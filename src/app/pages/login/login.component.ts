import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../../shared/button/button.component';
import { AuthenticationService } from '../../shared/services/authentication/authentication.service';
import AuthenticationState from 'src/models/IAuthenticationState';
import ApiConnectionState from 'src/models/IApiCallState';
import { LogoComponent } from '../../shared/logo/logo.component';
import { DecorativeIconComponent } from '../../shared/decorative-icon/decorative-icon.component';
import { Router } from '@angular/router';
import { CustomInputComponent } from '../../shared/custom-input/custom-input.component';
import { validationError } from './validators';

@Component({
  selector: 'nt-login',
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    LogoComponent,
    DecorativeIconComponent,
    CustomInputComponent,
  ],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  reactiveForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });
  //injects the service
  private authService = inject(AuthenticationService);
  // listen to changes in the auth state
  protected authState: Signal<AuthenticationState> = computed(() =>
    this.authService.getAuthenticationState(),
  );
  // listen to changes in the api connection state
  protected apiConnectionState: Signal<ApiConnectionState> = computed(() =>
    this.authService.getApiConnectionState(),
  );
  router = inject(Router);
  validationErrorObject = validationError;

  onSubmit() {
    const credentials = {
      password: this.reactiveForm.get('password')!.value,
      email: this.reactiveForm.get('email')!.value,
    };

    //this.router.navigate(['/']);

    // call the service to test credentials
    this.authService.login(credentials);
    // check authentication state
    if (this.isForbidden()) {
      this.getFormControl('password').setErrors({ wrongCredentials: true });
    }
  }

  isForbidden(): boolean {
    return (
      this.apiConnectionState().connectionFinish &&
      this.isFormEdited() &&
      this.authState().firstName === ''
    );
  }
  isFormEdited(): boolean {
    return (
      this.reactiveForm.get('email')!.touched &&
      this.reactiveForm.get('password')!.touched
    );
  }

  isFormValid(): boolean {
    return (
      this.reactiveForm.get('email')!.valid &&
      this.reactiveForm.get('password')!.valid
    );
  }

  isPasswordInvalid(): boolean {
    return (
      this.reactiveForm.get('password')!.invalid &&
      this.reactiveForm.get('password')!.touched
    );
  }
  getFormControl(controlName: string): FormControl {
    return this.reactiveForm.get(controlName) as FormControl;
  }
  isEmailInvalid(): boolean {
    return (
      this.reactiveForm.get('email')!.invalid &&
      this.reactiveForm.get('email')!.touched
    );
  }
}
