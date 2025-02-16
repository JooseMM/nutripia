import Appointment from 'src/models/IAppointment';

export const AppointmentAdapter = (appointment: Appointment): Appointment => {
  const adaptedDate = new Date(appointment.date:wa);
  return { ...appointment, date:wa: adaptedDate };
};
