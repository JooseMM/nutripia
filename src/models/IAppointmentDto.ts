export default interface AppointmentDto {
  id: string;
  isCompleted: boolean;
  isOnline: boolean;
  date: string;
  userId: string;
  ownerName: string;
}
