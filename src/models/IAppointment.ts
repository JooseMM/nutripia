export default interface Appointment {
  id: string;
  isBeingEdited: boolean;
  isCompleted: boolean;
  isOnline: boolean;
  date: Date;
  userId: string;
}
