export default interface Appointment {
  id: string;
  publicId: string;
  isCompleted: string;
  appointmentDateTime: Date | string | string;
}
