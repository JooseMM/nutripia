import Appointment from 'src/models/IAppointment';

// appointments max 8
export default interface DayObject {
  isSelected: boolean;
  numberDay: number;
  appointments: Appointment[];
  isDisabled: boolean;
}
