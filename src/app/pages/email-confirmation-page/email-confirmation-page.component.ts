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
import { UserAdministrationService } from '../administration/components/user-administration/services/user-administration.service';
import { ResponseTrackerService } from 'src/app/shared/services/response-tracker/response-tracker.service';

@Component({
  selector: 'nt-email-confirmation-page',
  imports: [ButtonComponent],
  templateUrl: './email-confirmation-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailConfirmationPageComponent {
  activedRouter = inject(ActivatedRoute);
  router = inject(Router);
  UserAdminService = inject(UserAdministrationService);
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
    isEmailConfirmed = this.UserAdminService.TryToConfirmEmail(userId, token);
    this.result.set(isEmailConfirmed);
    // give 2 seconds to redirect
    setTimeout(() => {
      this.router.navigate(['/administracion/agenda']);
    }, 2000);
  }
}
