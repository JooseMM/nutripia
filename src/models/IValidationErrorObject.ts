import { ValidationError } from './IValidationError';

export interface ValidationErrorObject {
  fullName: ValidationError[];
  email: ValidationError[];
  rut: ValidationError[];
  password: ValidationError[];
  passwordConfirm: ValidationError[];
  yearOfBirth: ValidationError[];
  phoneNumber: ValidationError[];
  previousDiagnostic: ValidationError[];
  goal: ValidationError[];
}
