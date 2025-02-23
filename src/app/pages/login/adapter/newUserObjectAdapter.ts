import NewClient from 'src/models/INewClient';
import User from 'src/models/IUser';

interface RawFormType {
  email: string;
  fullName: string;
  goal: string;
  passwordGroup: { password: string; passwordConfirm: string };
  phoneNumber: string;
  previousDiagnostic: string;
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
    previousDiagnostic: rawForm.previousDiagnostic,
    goal: rawForm.goal,
  };
};
