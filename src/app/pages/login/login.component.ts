import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  Inject,
  inject,
  OnChanges,
  signal,
  Signal,
  SimpleChanges,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../../shared/button/button.component';
import { AuthenticationService } from '../../shared/services/authentication/authentication.service';
import { LogoComponent } from '../../shared/logo/logo.component';
import { DecorativeIconComponent } from '../../shared/decorative-icon/decorative-icon.component';
import { Router } from '@angular/router';
import { CustomInputComponent } from '../../shared/custom-input/custom-input.component';
import { validationError } from './validators';
import {
  AUTH_TOKEN_NAME,
  letterSpaceSymbolsAndNumbers,
} from 'src/app/constants/app-constants';
import { catchError, finalize, of, Subscription, tap } from 'rxjs';
import ApiResponse from 'src/models/IApiResponse';
import AuthResponse from 'src/models/IAuthResponse';
import { toSignal } from '@angular/core/rxjs-interop';

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
  validationErrorObject = validationError;
  router = inject(Router);
  responseSubscription: Subscription = new Subscription();
  // reactive form
  form: FormGroup = new FormGroup({
    email: new FormControl('pia.nutricionista@gmail.com', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('6Esfer@s1997', [
      Validators.required,
      Validators.pattern(letterSpaceSymbolsAndNumbers),
    ]),
  });
  httpResponseIsLoading = signal(false);
  //injects the service
  private authenticationService = inject(AuthenticationService);
  // listen to changes in the auth state

  onSubmit() {
    const credentials = {
      password: this.form.get('password')!.value,
      email: this.form.get('email')!.value,
    };
    // update requestConnectionState for buttons animation
    this.httpResponseIsLoading.set(true);
    // call the service to test credentials
    this.responseSubscription = this.authenticationService
      .login(credentials)
      .pipe(finalize(() => this.httpResponseIsLoading.set(false)))
      .subscribe({
        next: (response: ApiResponse) => {
          const data = response.data as AuthResponse;
          localStorage.setItem(AUTH_TOKEN_NAME, data.token);
          this.router.navigate(['/']);
        },
        error: () => {
          localStorage.removeItem(AUTH_TOKEN_NAME);
          this.getFormControl('password').setErrors({
            wrongCredentials: true,
          });
        },
      });
  }

  isFormEdited(): boolean {
    return (
      this.form.get('email')!.touched && this.form.get('password')!.touched
    );
  }

  isFormValid(): boolean {
    return this.form.get('email')!.valid && this.form.get('password')!.valid;
  }

  isPasswordInvalid(): boolean {
    return (
      this.form.get('password')!.invalid && this.form.get('password')!.touched
    );
  }
  getFormControl(controlName: string): FormControl {
    return this.form.get(controlName) as FormControl;
  }
  isEmailInvalid(): boolean {
    return this.form.get('email')!.invalid && this.form.get('email')!.touched;
  }
}
