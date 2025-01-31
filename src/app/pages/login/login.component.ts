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

@Component({
  selector: 'nt-login',
  imports: [ReactiveFormsModule, ButtonComponent],
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
  protected isForbidden: Signal<boolean | undefined> = computed(() => {
    const state = this.authService.getState();
    return state.serverConnectionSuccess && state.token === '';
  });

  onSubmit() {
    const credentials = {
      password: this.reactiveForm.get('password')!.value,
      email: this.reactiveForm.get('email')!.value,
    };
    // call the service to update its state
    console.log(credentials);
    this.authService.login(credentials);
    // pass the state to the isForbidden variable
  }

  isFormEdited(): boolean {
    return (
      this.reactiveForm.get('email')!.touched &&
      this.reactiveForm.get('password')!.touched
    );
  }

  isEmailValid(): boolean {
    return (
      this.reactiveForm.get('email')!.invalid &&
      this.reactiveForm.get('email')!.touched
    );
  }
}
