import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '../../shared/button/button.component';
import { ResponseTrackerService } from 'src/app/shared/services/response-tracker/response-tracker.service';
import { AuthenticationService } from 'src/app/shared/services/authentication/authentication.service';

@Component({
  selector: 'nt-email-confirmation-page',
  imports: [ButtonComponent],
  templateUrl: './email-confirmation-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailConfirmationPageComponent {
  activedRouter = inject(ActivatedRoute);
  router = inject(Router);
  authService = inject(AuthenticationService);
  ResponeTrackingService = inject(ResponseTrackerService);
  result: WritableSignal<boolean | null> = signal(null);
  isLoading = computed(() => this.ResponeTrackingService.getState().isLoading);

  tryToConfirmEmail(): void {
    let isEmailConfirmed = false;
    const paramMap = this.activedRouter.snapshot.paramMap;
    const userId = paramMap.get('userId');
    const token = paramMap.get('token');
    if (!userId || !token) {
      return this.result.set(false);
    }
    // if operation succed return true otherwise false
    isEmailConfirmed = this.authService.TryToConfirmEmail(userId, token);
    this.result.set(isEmailConfirmed);
    // give 2 seconds to redirect
    setTimeout(() => {
      this.router.navigate(['/administracion/agenda']);
    }, 1000);
  }
}
