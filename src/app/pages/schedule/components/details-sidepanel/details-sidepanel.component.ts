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
  selectedBoxId: WritableSignal<string> = signal('');
  /*
   * own functions
   */
  constructor() {
    effect(() => {
      const appointmentExists = this.appointmentsAtCurrentDate().find(
        (item) => item.id === this.selectedBoxId(),
      );
      if (
        this.selectedBoxId() &&
        !appointmentExists &&
        !this.onEditAppointment()
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
      (appointment: Appointment) => appointment.id === this.selectedBoxId(),
    );
    this.appointmentService.startEditingAppointment(appointment!);
    this.isNewAppointmentOnline.set(appointment!.isOnline);
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
    this.isNewAppointment.set(false);
    this.selectedBoxId.set('');
    this.responseTrackerService.resetState();
  }
  getMainButtonLabel(): string {
    if (this.isNewAppointment()) {
      return 'Reservar';
    } else if (this.selectedBoxId()) {
      return 'Modificar';
    } else if (this.onEditAppointment()) {
      return 'Actualizar';
    } else {
      return 'Crear Cita';
    }
  }
  getMainButtonOnClickHandler(): void {
    if (this.selectedBoxId()) {
      if (this.onEditAppointment() !== null) {
        this.saveAppointment();
        this.reset();
      } else {
        this.startEditingAppointment();
      }
    } else if (this.isNewAppointment()) {
      this.saveAppointment();
      this.reset();
    } else {
      this.isNewAppointment.set(true);
    }
  }
  shouldDisable() {
    const creatingOrModifying =
      this.onEditAppointment() || this.isNewAppointment();
    const isCurrentUserAdmin = this.currentRole() === ADMIN_ROLE;
    const currentUserId =
      this.authenticationService.getAuthenticationState().id;

    if (!isCurrentUserAdmin) {
      if (!creatingOrModifying && this.selectedBoxId()) {
        const selectedAppointment = this.appointmentsAtCurrentDate().find(
          (appointment: Appointment) => appointment.id === this.selectedBoxId(),
        );
        return currentUserId !== selectedAppointment?.userId;
      }
    }
    if (creatingOrModifying && this.isDateTaken()) {
      return true;
    }
    if (this.appointmentsAtCurrentDate().length >= 8) {
      return true;
    }

    return false;
  }
}
