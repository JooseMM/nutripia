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
import { SidePanelButtonsComponent } from './components/side-panel-buttons/side-panel-buttons.component';

@Component({
  selector: 'nt-details-sidepanel',
  imports: [
    NgClass,
    ButtonComponent,
    AppointmentInfoBoxComponent,
    SidePanelButtonsComponent,
  ],
  templateUrl: './details-sidepanel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsSidepanelComponent {
  ADMIN_ROLE = ADMIN_ROLE;
  CLIENT_ROLE = CLIENT_ROLE;
  authenticationService = inject(AuthenticationService);
  appointmentService = inject(AppoitmentService);
  responseTrackerService = inject(ResponseTrackerService);
  selectedDate: Signal<Date> = computed(() =>
    this.appointmentService.getSelectedDate(),
  );
  appointmentArray: Signal<Appointment[]> = computed(() => {
    if (this.appointmentService.isCreatingOrModifiying()) {
      return this.appointmentService.getAppointmentBeingModify();
    }
    const date = this.selectedDate();
    return this.appointmentService.getAppointmentByDate(
      date.getDate(),
      date.getMonth(),
      date.getFullYear(),
    );
  });
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
      if (this.appointmentService.getShouldStopEditing()) {
        this.cancelAction();
        this.appointmentService.toggleShouldStopEditing();
      }
    });
  }
  isAppointmentOnline(): boolean {
    const appointment = this.appointmentService.getAppointmentBeingModify();
    return appointment[0].isOnline;
  }
  setAppointmentMode(isOnline: boolean): void {
    this.appointmentService.setAppointmentMode(isOnline);
  }
  getTime(date: Date): string {
    return getHoursToString(date);
  }
  updateHourBy(number: number) {
    this.appointmentService.updateHour(number);
  }
  setAppointmentIsOnline(isOnline: boolean) {
    this.appointmentService.setAppointmentMode(isOnline);
  }
  cancelAction(): void {
    const isUserCreating =
      this.appointmentArray().length === 1 &&
      this.appointmentArray()[0].isBeingEdited &&
      this.appointmentArray()[0].id === '';

    if (isUserCreating) {
      this.appointmentService.removeNotFinished();
    } else {
      this.appointmentService.cancelModification();
    }
    this.selectedBox.set('');
    this.responseTrackerService.resetState();
  }
  isUserAdmin(userInfo: AuthenticationState) {
    if (!userInfo) {
      throw new Error('user not authenticated');
    }
    return userInfo.role === ADMIN_ROLE;
  }
  isUserOwner(
    currentUserInfo: AuthenticationState,
    selectedAppointmendBoxId: string,
  ): boolean {
    const appointment = this.appointmentService.getAppointmentById(
      selectedAppointmendBoxId,
    );
    return appointment?.userId === currentUserInfo.id;
  }
  isAppointmentCompleted(selectedAppointmentId: string) {
    const appointment = this.appointmentService.getAppointmentById(
      selectedAppointmentId,
    );
    return appointment.isCompleted;
  }
  isDateAvailable(): boolean {
    if (this.appointmentService.didUserReachLimit()) {
      return false;
    } else if (this.appointmentService.isSelectedDateInThePast()) {
      console.log('is past');
      return false;
    } else if (!this.appointmentService.isDateAndTimeNotTaken()) {
      console.log('is taken');
      return false;
    } else {
      return true;
    }
  }
  isUserNotAllowToModify(
    selectedAppointmendBoxId: string,
    currentUserInfo: AuthenticationState,
  ) {
    const isCreatingOrModifiying =
      this.appointmentService.isCreatingOrModifiying();
    if (selectedAppointmendBoxId && !isCreatingOrModifiying) {
      if (this.isAppointmentCompleted(selectedAppointmendBoxId)) {
        return true;
      } else {
        return !this.isUserOwner(currentUserInfo, selectedAppointmendBoxId);
      }
    }
    if (isCreatingOrModifiying) {
      if (this.appointmentService.didUserReachLimit()) {
        return true;
      } else if (this.appointmentService.isSelectedDateInThePast()) {
        return true;
      } else if (!this.appointmentService.isDateAndTimeNotTaken()) {
        return true;
      } else {
        return false;
      }
    } else {
      const isDateValid = !this.appointmentService.isSelectedDateInThePast();
      const didUserReachLimit = this.appointmentService.didUserReachLimit();
      if (!isDateValid) {
        return true;
      } else if (didUserReachLimit) {
        return true;
      }
      return false;
    }
  }
  getMainButtonLabel(selectedBoxId: string): string {
    const isCreatingOrModifiying =
      this.appointmentService.isCreatingOrModifiying() && true;
    if (isCreatingOrModifiying && !selectedBoxId) {
      return 'Guardar Cita';
    } else if (!isCreatingOrModifiying && selectedBoxId) {
      return 'Modificar Cita';
    } else {
      return 'Crear Cita';
    }
  }
  onClickHandler(selectedBoxId: string): void {
    const isCreatingOrModifiying =
      !!this.appointmentService.isCreatingOrModifiying();
    if (isCreatingOrModifiying) {
      this.appointmentService.saveChanges();
    } else {
      this.appointmentService.createOrModify(selectedBoxId);
    }
  }
  isBeingSelected(id: string): boolean {
    return this.selectedBox() === id;
  }
  selectNewOrNull(newId: string, oldId: string) {
    this.selectedBox.set(newId === oldId ? '' : newId);
  }
  toggleCompletedState(id: string) {
    if (!id) {
      throw new Error('id is null or undefined');
    }
    this.appointmentService.toggleCompletedState(id);
  }
  deleteOnById(id: string) {
    if (!id) {
      throw new Error('id is null or undefined');
    }
    this.appointmentService.deleteOnById(id);
    this.cancelAction();
  }
}
