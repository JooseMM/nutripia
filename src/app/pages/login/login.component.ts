import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
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
import { letterSpaceSymbolsAndNumbers } from 'src/app/constants/app-constants';
import { finalize, Subscription } from 'rxjs';
import AuthenticationState from 'src/models/IAuthenticationState';
import { ResponseTrackerService } from 'src/app/shared/services/response-tracker/response-tracker.service';

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
})
export class LoginComponent implements OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  validationErrorObject = validationError;
  router = inject(Router);
  authenticationState: Subscription = new Subscription();
  responseTrackingService = inject(ResponseTrackerService);
  isLoading = computed(() => this.responseTrackingService.getState().isLoading);
  // reactive form
  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(letterSpaceSymbolsAndNumbers),
    ]),
  });
  //injects the service
  private authenticationService = inject(AuthenticationService);
  // listen to changes in the auth state

  onSubmit() {
    const credentials = {
      password: this.form.get('password')!.value,
      email: this.form.get('email')!.value,
    };
    // update requestConnectionState for buttons animation
    // call the service to test credentials
    this.authenticationService.login(credentials);
    this.authenticationState = this.authenticationService.authenticationState$
      .pipe(finalize(() => this.cdr.markForCheck()))
      .subscribe({
        next: (response: AuthenticationState) => {
          switch (response.error) {
            case 'wrongCredentials':
              this.getFormControl('password').setErrors({
                wrongCredentials: true,
              });
              break;
            case 'emailIsNotConfirmed':
              this.getFormControl('email').setErrors({
                emailIsNotConfirmed: true,
              });
              break;
            case '':
              this.router.navigate(['/']);
              break;
          }
        },
      });
  }
  isFormEdited(): boolean {
    return this.form.get('email')!.dirty && this.form.get('password')!.dirty;
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
  ngOnDestroy(): void {
    this.authenticationState.unsubscribe();
  }
}
