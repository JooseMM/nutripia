import { ValidatorFn } from '@angular/forms';

export interface RegisterValidatorsArray {
  fullName: ValidatorFn[];
  email: ValidatorFn[];
  rut: ValidatorFn[];
  password: ValidatorFn[];
  passwordConfirm: ValidatorFn[];
  yearOfBirth: ValidatorFn[];
  phoneNumber: ValidatorFn[];
  previousDiagnostics: ValidatorFn[];
  goals: ValidatorFn[];
}
