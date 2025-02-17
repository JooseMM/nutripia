import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { AppoitmentService } from 'src/app/shared/services/appoitments/appoitments.service';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { ADMIN_ROLE, CLIENT_ROLE } from 'src/app/constants/app-constants';
import { AuthenticationService } from 'src/app/shared/services/authentication/authentication.service';
import { ResponseTrackerService } from 'src/app/shared/services/response-tracker/response-tracker.service';
import { AppointmentInfoBoxComponent } from './components/appointment-info-box/appointment-info-box.component';

@Component({
  selector: 'nt-details-sidepanel',
  imports: [NgClass, ButtonComponent, AppointmentInfoBoxComponent],
  templateUrl: './details-sidepanel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsSidepanelComponent {
  authenticationService = inject(AuthenticationService);
  appointmentService = inject(AppoitmentService);
  responseTrackerService = inject(ResponseTrackerService);
  getTime: Signal<string> = computed(() =>
    this.appointmentService
      .getSelectedDate()
      .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  );
  isAppointmentOnline: WritableSignal<boolean> = signal(false);
  ADMIN_ROLE = ADMIN_ROLE;
  CLIENT_ROLE = CLIENT_ROLE;
  currentRole: Signal<string> = computed(
    () => this.authenticationService.getAuthenticationState().role,
  );
  isResponseLoading: Signal<boolean> = computed(
    () => this.responseTrackerService.getState().isLoading,
  );

  updateHourBy(number: number) {
    this.appointmentService.updateHour(number);
  }
  setAppointmentIsOnline(isOnline: boolean) {
    this.isAppointmentOnline.set(isOnline);
  }
  saveAppointment() {
    this.appointmentService.saveAppointment(this.isAppointmentOnline());
  }
}
