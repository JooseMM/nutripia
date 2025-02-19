import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { AppoitmentService } from 'src/app/shared/services/appoitments/appoitments.service';
import { ButtonComponent } from '../../../../shared/button/button.component';
import {
  ADMIN_ROLE,
  CLIENT_ROLE,
  MONTH_NAMES,
} from 'src/app/constants/app-constants';
import { AuthenticationService } from 'src/app/shared/services/authentication/authentication.service';
import { ResponseTrackerService } from 'src/app/shared/services/response-tracker/response-tracker.service';
import { AppointmentInfoBoxComponent } from './components/appointment-info-box/appointment-info-box.component';
import Appointment from 'src/models/IAppointment';
import ResponseState from 'src/models/IApiCallState';

@Component({
  selector: 'nt-details-sidepanel',
  imports: [NgClass, ButtonComponent, AppointmentInfoBoxComponent],
  templateUrl: './details-sidepanel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsSidepanelComponent {
  /*
   * own fields
   */
  ADMIN_ROLE = ADMIN_ROLE;
  CLIENT_ROLE = CLIENT_ROLE;
  isNewAppointmentOnline: WritableSignal<boolean> = signal(false);
  isNewAppointment: WritableSignal<boolean> = signal(false);
  authenticationService = inject(AuthenticationService);
  appointmentService = inject(AppoitmentService);
  responseTrackerService = inject(ResponseTrackerService);
  /*
   * computed signals
   */
  appointmentsAtCurrentDate: Signal<Appointment[]> = computed(() =>
    this.appointmentService
      .getAppointments()
      .filter((appointment: Appointment) => {
        const date = appointment.date as Date;
        const selectedDate = this.appointmentService.getSelectedDate();
        return (
          date.getMonth() === selectedDate.getMonth() &&
          date.getDate() === selectedDate.getDate()
        );
      }),
  );
  getSelectedDateTime: Signal<string> = computed(() =>
    this.getTime(this.appointmentService.getSelectedDate()),
  );
  currentRole: Signal<string> = computed(
    () => this.authenticationService.getAuthenticationState().role,
  );
  responseState: Signal<ResponseState> = computed(() =>
    this.responseTrackerService.getState(),
  );
  onEditAppointment: Signal<Appointment | null> = computed(() =>
    this.appointmentService.getEditedAppointment(),
  );
  getLongSelectedDate: Signal<string> = computed(() => {
    const date = this.appointmentService.getSelectedDate();
    return this.getLongDate(date.getDate(), date.getMonth());
  });
  selectedAppointmentId: WritableSignal<string> = signal('');
  /*
   * own functions
   */
  constructor() {
    effect(() => {
      const match = this.appointmentsAtCurrentDate().find(
        (appointment: Appointment) =>
          appointment.id === this.selectedAppointmentId(),
      );
      if (!match) {
        this.selectedAppointmentId.set('');
      }
      if (
        this.responseState().isComplete &&
        (this.onEditAppointment() || this.isNewAppointment())
      ) {
        this.reset();
      }
    });
  }
  getLongDate(day: number, month: number): string {
    return `${day} de ${MONTH_NAMES[month]}`;
  }
  getTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  updateHourBy(number: number) {
    this.appointmentService.updateHour(number);
  }
  setAppointmentIsOnline(isOnline: boolean) {
    this.isNewAppointmentOnline.set(isOnline);
  }
  saveAppointment() {
    this.appointmentService.saveChanges(this.isNewAppointmentOnline());
  }
  startEditingAppointment() {
    const appointment = this.appointmentsAtCurrentDate().find(
      (appointment: Appointment) =>
        appointment.id === this.selectedAppointmentId(),
    );
    this.appointmentService.startEditingAppointment(appointment!);
    this.isNewAppointmentOnline.set(appointment!.isOnline);
  }
  setIsNewAppointment(isNew: boolean): void {
    this.isNewAppointment.set(isNew);
  }
  isDateTaken(): boolean {
    const current = this.appointmentService.getSelectedDate().getTime();
    let match = false;
    this.appointmentsAtCurrentDate().forEach((appointment: Appointment) => {
      if ((appointment.date as Date).getTime() === current) {
        match = true;
      }
    });
    return match;
  }
  reset(): void {
    this.appointmentService.startEditingAppointment(null);
    this.setIsNewAppointment(false);
    this.selectedAppointmentId.set('');
    this.responseTrackerService.resetState();
  }
  getMainButtonLabel(): string {
    if (this.selectedAppointmentId()) {
      return this.onEditAppointment() ? 'Actualizar' : 'Modificar';
    } else if (this.isNewAppointment()) {
      return 'Reservar';
    } else {
      return '¡Reserva tu cita!';
    }
  }
  getMainButtonOnClickHandler(): void {
    if (this.onEditAppointment() || this.isNewAppointment()) {
      return this.saveAppointment();
    }
    if (this.selectedAppointmentId()) {
      return this.startEditingAppointment();
    }
    this.setIsNewAppointment(true);
  }
  shouldDisable() {
    const creatingOrModifying =
      this.onEditAppointment() || this.isNewAppointment();
    const isCurrentUserAdmin = this.currentRole() === ADMIN_ROLE;
    const currentUserId =
      this.authenticationService.getAuthenticationState().id;

    if (!isCurrentUserAdmin) {
      if (!creatingOrModifying && this.selectedAppointmentId()) {
        const selectedAppointment = this.appointmentsAtCurrentDate().find(
          (appointment: Appointment) =>
            appointment.id === this.selectedAppointmentId(),
        );
        return currentUserId !== selectedAppointment?.userId;
      }
    }
    if (creatingOrModifying && this.isDateTaken()) {
      return true;
    }

    return false;
  }
}
