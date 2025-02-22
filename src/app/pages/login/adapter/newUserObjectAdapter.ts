import NewClient from 'src/models/INewClient';
import User from 'src/models/IUser';

interface RawFormType {
  email: string;
  fullName: string;
  goals: string;
  passwordGroup: { password: string; passwordConfirm: string };
  phoneNumber: string;
  previousDiagnostics: string;
  rut: string;
  yearOfBirth: number;
}

export const newUserObjectAdapter = (rawForm: RawFormType): NewClient => {
  return {
    fullName: rawForm.fullName,
    yearOfBirth: rawForm.yearOfBirth,
    email: rawForm.email,
    rut: rawForm.rut,
    phoneNumber: rawForm.phoneNumber,
    password: rawForm.passwordGroup.password,
    previousDiagnostic: rawForm.previousDiagnostics,
    goals: rawForm.goals,
  };
};
