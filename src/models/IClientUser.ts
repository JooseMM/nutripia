export default interface ClientUser {
  id: string;
  fullName: string;
  age: number;
  rut: string;
  email: string;
  role: 'admin_user' | 'client_user';
  previousDiagnostics: string;
  goals: string;
  hasPaid: boolean;
}
