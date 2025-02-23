export default interface Appointment {
  id: string;
  isCompleted: boolean;
  isOnline: boolean;
  date: Date | string;
  userId: string;
}
