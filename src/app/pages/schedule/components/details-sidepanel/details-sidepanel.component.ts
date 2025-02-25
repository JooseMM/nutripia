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
  getHoursToString,
} from 'src/app/constants/app-constants';
import { AuthenticationService } from 'src/app/shared/services/authentication/authentication.service';
import { ResponseTrackerService } from 'src/app/shared/services/response-tracker/response-tracker.service';
import { AppointmentInfoBoxComponent } from './components/appointment-info-box/appointment-info-box.component';
import Appointment from 'src/models/IAppointment';
import ResponseState from 'src/models/IApiCallState';
import AuthenticationState from 'src/models/IAuthenticationState';

@Component({
  selector: 'nt-details-sidepanel',
  imports: [NgClass, ButtonComponent, AppointmentInfoBoxComponent],
  templateUrl: './details-sidepanel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsSidepanelComponent {
  ADMIN_ROLE = ADMIN_ROLE;
  CLIENT_ROLE = CLIENT_ROLE;
  isOnline: WritableSignal<boolean> = signal(false);
  authenticationService = inject(AuthenticationService);
  appointmentService = inject(AppoitmentService);
  responseTrackerService = inject(ResponseTrackerService);
  appointmentArray: Signal<Appointment[]> = computed(() => {
    const bank = this.appointmentService.getAppointments();
    const found: Appointment | undefined = bank.find(
      (item) => item.isBeingEdited,
    );

    if (found !== undefined) {
      return [found];
    }
    return this.filterAppointmentByDay(bank, this.selectedDate()).sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    );
  });
  selectedDate: Signal<Date> = computed(() =>
    this.appointmentService.getSelectedDate(),
  );
  currentUserInfo: Signal<AuthenticationState> = computed(() =>
    this.authenticationService.getAuthenticationState(),
  );
  responseState: Signal<ResponseState> = computed(() =>
    this.responseTrackerService.getState(),
  );
  selectedBox: WritableSignal<string> = signal('');
  /*
   * own functions
   */
  constructor() {
    effect(() => {
      const currentDate = this.selectedDate();
      const isModifiying = this.isCreatingOrModifiying(this.appointmentArray());
      if (currentDate) {
        this.selectedBox.update((oldState) => (isModifiying ? oldState : ''));
      }
    });
  }
  filterAppointmentByDay(
    appointmentBank: Appointment[],
    date: Date,
  ): Appointment[] {
    return appointmentBank.filter((item) => {
      return item.date.getDate() === date.getDate();
    });
  }
  getTime(date: Date): string {
    return getHoursToString(date);
  }
  updateHourBy(number: number) {
    this.appointmentService.updateHour(number);
  }
  setAppointmentIsOnline(isOnline: boolean) {
    this.isOnline.set(isOnline);
  }
  cancelAction(): void {
    this.selectedBox.set('');
    this.responseTrackerService.resetState();
    const isUserCreating =
      this.appointmentArray.length === 1 &&
      this.appointmentArray()[0].isBeingEdited &&
      this.appointmentArray()[0].id === '';

    if (isUserCreating) {
      this.appointmentService.removeNotFinished();
    } else {
      this.appointmentService.cancelModification();
    }
  }
  isCreatingOrModifiying(appointmentArray: Appointment[]): boolean {
    const found = appointmentArray.find((item) => item.isBeingEdited);
    return found !== undefined; // if found is not null return true otherwise false
  }
  isUserOwnerOrAdmin(
    currentUserInfo: AuthenticationState,
    appointmentArray: Appointment[],
    selectedAppointmendBoxId: string,
  ): boolean {
    const appointment = appointmentArray.find(
      (item) => item.id === selectedAppointmendBoxId,
    );
    if (appointment?.userId === currentUserInfo.id) {
      return true;
    } else if (currentUserInfo.role === ADMIN_ROLE) {
      return true;
    } else {
      return false;
    }
  }
  isUserNotAllowToModify(
    selectedAppointmendBoxId: string,
    appointmentArray: Appointment[],
    currentUserInfo: AuthenticationState,
  ) {
    if (selectedAppointmendBoxId) {
      const isUserEditing =
        appointmentArray.length === 1 && appointmentArray[0].isBeingEdited;

      if (isUserEditing) {
        // if the user is editing an appointment
        return !this.appointmentService.isSelectedDateAvailable();
      }
      return !this.isUserOwnerOrAdmin(
        currentUserInfo,
        appointmentArray,
        selectedAppointmendBoxId,
      );
    } else {
      return false;
    }
  }
  getMainButtonLabel(
    appointmentArray: Appointment[],
    selectedBoxId: string,
  ): string {
    const isCreatingOrModifiying =
      this.isCreatingOrModifiying(appointmentArray) && true;
    if (isCreatingOrModifiying && !selectedBoxId) {
      return 'Guardar Cita';
    } else if (!isCreatingOrModifiying && selectedBoxId) {
      return 'Modificar Cita';
    } else {
      return 'Crear Cita';
    }
  }
  onClickHandler(appointmentArray: Appointment[], selectedBoxId: string): void {
    const isCreatingOrModifiying =
      this.isCreatingOrModifiying(appointmentArray) && true;
    if (isCreatingOrModifiying) {
      this.appointmentService.saveChanges();
    } else {
      this.appointmentService.createOrModify(selectedBoxId);
    }
  }
  isBeingSelected(id: string): boolean {
    return this.selectedBox() === id;
  }
}
