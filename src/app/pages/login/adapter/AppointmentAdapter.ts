import Appointment from 'src/models/IAppointment';

export const AppointmentAdapter = (appointment: Appointment): Appointment => {
  const adaptedDate = new Date(appointment.appointmentDateTime);
  return { ...appointment, appointmentDateTime: adaptedDate };
};
