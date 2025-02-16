import User from './IUser';

export default interface Appointment {
  id: string;
  publicId: string;
  isCompleted: boolean;
  isOnline: boolean;
  date: Date | string | string;
  userId: string;
  user: User | null; //for now
}
