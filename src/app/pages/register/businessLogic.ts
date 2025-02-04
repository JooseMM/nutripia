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
interface ValidationErrorObjectHandler {
  fullName: ValidationErrorObject[];
  email: ValidationErrorObject[];
  password: ValidationErrorObject[];
  passwordConfirm: ValidationErrorObject[];
  age: ValidationErrorObject[];
  phoneNumber: ValidationErrorObject[];
  previousDiagnostics: ValidationErrorObject[];
}
interface ValidationErrorObject {
  errorName: string;
  output: string;
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

export const validationError: ValidationErrorObjectHandler = {
  fullName: [
    { errorName: 'required', output: 'El nombre completo es requerido' },
    {
      errorName: 'pattern',
      output: 'El nombre solo debe contener letras y espacios',
    },
  ],
  email: [
    { errorName: 'required', output: 'El email  es requerido' },
    {
      errorName: 'email',
      output: 'Formato de email invalido',
    },
  ],
  age: [{ errorName: 'required', output: 'El nombre completo es requerido' }],
  password: [
    { errorName: 'required', output: 'El nombre completo es requerido' },
  ],
  passwordConfirm: [
    { errorName: 'required', output: 'El nombre completo es requerido' },
  ],
  phoneNumber: [
    { errorName: 'required', output: 'El nombre completo es requerido' },
  ],
  previousDiagnostics: [
    { errorName: 'required', output: 'El nombre completo es requerido' },
  ],
};
function doPasswordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const passwordMatch = control.get('passwordConfirm')?.value;
    return password === passwordMatch ? null : { notMatchingPassword: true };
  };
}
