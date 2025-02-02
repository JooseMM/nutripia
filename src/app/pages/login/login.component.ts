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
import { AuthenticationService } from './services/authentication.service';
import AuthenticationState from 'src/models/IAuthenticationState';
import ApiConnectionState from 'src/models/IApiCallState';
import { LogoComponent } from '../../shared/logo/logo.component';
import { DecorativeIconComponent } from '../../shared/decorative-icon/decorative-icon.component';
import { Router } from '@angular/router';

@Component({
  selector: 'nt-login',
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    LogoComponent,
    DecorativeIconComponent,
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

  onSubmit() {
    const credentials = {
      password: this.reactiveForm.get('password')!.value,
      email: this.reactiveForm.get('email')!.value,
    };

    //this.router.navigate(['/']);

    // call the service to update its state
    this.authService.login(credentials);
    // pass the state to the isForbidden variable
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
  isEmailInvalid(): boolean {
    return (
      this.reactiveForm.get('email')!.invalid &&
      this.reactiveForm.get('email')!.touched
    );
  }
}
