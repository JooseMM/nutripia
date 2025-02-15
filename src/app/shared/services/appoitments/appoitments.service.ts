import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { API_URL, WORK_START_HOUR } from 'src/app/constants/app-constants';
import Appointment from 'src/models/IAppointment';
import mockDates from './mockData';

@Injectable({
  providedIn: 'root',
})
export class AppoitmentsService {
  URL = `${API_URL}/appointments`;
  appointments = signal(mockDates);
  http = inject(HttpClient);

  getAppointments() {
    return this.appointments();
  }
  getCurrentDate(): Date {
    const now = new Date();
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      WORK_START_HOUR,
      0,
      0,
      0,
    );
  }
  getAll(): void {
    //this.http.get()
  }
  createOne(newAppointment: { date: Date; isOnline: boolean }): void {
    //this.http.post();
  }
  updateOne(newAppointment: Appointment) {}
  removeOne(id: string) {}
}
