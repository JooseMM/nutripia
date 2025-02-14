export default interface User {
  id: string;
  fullName: string;
  rut: string;
  yearOfBirth: number;
  phoneNumber: string;
  email: string;
  role: 'admin_user' | 'client_user';
  previousDiagnostics: string;
  goals: string;
  hasPaid: boolean;
  markedForChange: boolean;
}
