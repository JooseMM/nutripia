import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  letterAndSpacesPattern,
  letterSpaceAndSymbols,
  letterSpaceSymbolsAndNumbers,
} from 'src/app/constants/app-constants';

interface RegisterBusinessLogicValidators {
  fullName: ValidatorFn[];
  email: ValidatorFn[];
  password: ValidatorFn[];
  passwordConfirm: ValidatorFn[];
  age: ValidatorFn[];
  phoneNumber: ValidatorFn[];
  previousDiagnostics: ValidatorFn[];
}
export const registerBusinessLogicValidators: RegisterBusinessLogicValidators =
  {
    fullName: [Validators.required, Validators.pattern(letterAndSpacesPattern)],
    email: [Validators.required, Validators.email],
    age: [Validators.required, Validators.min(1), Validators.max(99)],
    password: [
      Validators.required,
      Validators.pattern(letterSpaceSymbolsAndNumbers),
    ],
    passwordConfirm: [doPasswordMatchValidator()],
    phoneNumber: [
      Validators.required,
      Validators.minLength(9),
      Validators.maxLength(15),
    ],
    previousDiagnostics: [Validators.pattern(letterSpaceAndSymbols)],
  };

function doPasswordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const passwordMatch = control.get('passwordConfirm')?.value;
    console.log(password);
    console.log(passwordMatch);
    console.log(control.errors);
    return password === passwordMatch ? null : { notMatchingPassword: true };
  };
}
