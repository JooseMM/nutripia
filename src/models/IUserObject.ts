export default interface UserObject {
  fullName: string;
  yearOfBirth: number;
  email: string;
  rut: string;
  phoneNumber: string;
  password: string;
  previousDiagnostic: string | null;
  goals: string;
}
