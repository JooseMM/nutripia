export default interface User {
  id: string;
  fullName: string;
  rut: string;
  yearOfBirth: number;
  phoneNumber: string;
  email: string;
  role: 'admin_user' | 'client_user';
  previousDiagnostic: string;
  goal: string;
  hasPaid: boolean;
  markedForChange: boolean;
}
