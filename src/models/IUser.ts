export default interface User {
  id: string;
  fullName: string;
  age: number;
  rut: string;
  yearOfBirth: number;
  phoneNumber: string;
  email: string;
  role: 'admin_user' | 'client_user';
  previousDiagnostics: string;
  goals: string;
  hasPaid: boolean;
  markForChange: boolean;
}
