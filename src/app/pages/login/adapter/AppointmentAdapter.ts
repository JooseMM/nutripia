import Appointment from 'src/models/IAppointment';
import AppointmentDto from 'src/models/IAppointmentDto';

export const appointmentAdapter = (
  appointment: AppointmentDto,
): Appointment => {
  const adaptedDate = new Date(appointment.date);
  return {
    ...appointment,
    date: adaptedDate,
    isBeingEdited: false,
    ownerName: appointment.ownerName,
  };
};
