import Appointment from 'src/models/IAppointment';

export const appointmentAdapter = (appointment: Appointment): Appointment => {
  const adaptedDate = new Date(appointment.date);
  return { ...appointment, date: adaptedDate };
};
