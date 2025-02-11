import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { API_URL } from 'src/app/constants/app-constants';
import Appointment from 'src/models/IAppointment';

@Injectable({
  providedIn: 'root',
})
export class AppoitmentsService {
  URL = `${API_URL}/appointments`;
  appointmentArray = signal([]);
  http = inject(HttpClient);
  constructor() {}
  getAppointments() {
    return this.appointmentArray();
  }
  getAll(): void {
    //this.http.get()
  }
  createOne(Date): void {
    this.http.post();
  }
  updateOne(newAppointment: Appointment) {}
  removeOne(id: string) {}
}
