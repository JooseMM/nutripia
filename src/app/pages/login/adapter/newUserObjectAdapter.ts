import User from 'src/models/IClientUser';
import UserObject from 'src/models/IUserObject';

interface RawFormType {
  email: string;
  fullName: string;
  goals: string;
  passwordGroup: { password: string; passwordConfirm: string };
  phoneNumber: string;
  previousDiagnostics: string | null;
  rut: string;
  yearOfBirth: number;
}

export const newUserObjectAdapter = (rawForm: RawFormType): User => {
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
