import { WORK_START_HOUR } from 'src/app/constants/app-constants';
import Appointment from 'src/models/IAppointment';

const getMockAppointment = (day: number, hour?: number): Appointment => {
  const now = new Date();
  now.setDate(day);
  now.setHours(hour ?? WORK_START_HOUR);
  now.setMinutes(0);
  now.setSeconds(0);
  now.setMilliseconds(0);
  return {
    id: `id-${now.getDate()}`,
    publicId: 'bs134',
    isCompleted: false,
    date: now,
    userId: '123',
    user: null,
  } as Appointment;
};
const mockDates: Appointment[] = [
  getMockAppointment(14),
  getMockAppointment(20, 12),
  getMockAppointment(30, 9),
];

export default mockDates;
