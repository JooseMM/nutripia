import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  chileanRutValidator,
  letterAndSpacesPattern,
  letterSpaceAndSymbols,
  letterSpaceSymbolsAndNumbers,
} from 'src/app/constants/app-constants';
import { RegisterValidatorsArray } from 'src/models/IRegisterValidatorsArray';
import { ValidationErrorObject } from 'src/models/IValidationErrorObject';

/*
 * Validators for the Register Input
 */
export const registerBusinessLogicValidators: RegisterValidatorsArray = {
  fullName: [Validators.required, Validators.pattern(letterAndSpacesPattern)],
  email: [Validators.required, Validators.email],
  rut: [Validators.required, Validators.pattern(chileanRutValidator)],
  yearOfBirth: [
    Validators.required,
    Validators.min(1900),
    Validators.max(new Date().getFullYear()),
  ],
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
  goals: [Validators.pattern(letterSpaceSymbolsAndNumbers)],
};

/*
 * Validation output for the inputs
 */
export const validationError: ValidationErrorObject = {
  fullName: [
    { errorName: 'required', output: 'El nombre completo es requerido' },
    {
      errorName: 'pattern',
      output: 'El nombre solo debe contener letras y espacios',
    },
  ],
  email: [
    { errorName: 'required', output: 'El email es requerido' },
    {
      errorName: 'email',
      output: 'Formato de email invalido',
    },
    {
      errorName: 'emailAlreadyExists',
      output: 'El correo electronico ya posee una cuenta asociada',
    },
  ],
  rut: [
    { errorName: 'required', output: 'El RUT es requerido' },
    {
      errorName: 'pattern',
      output: 'Formato de RUT inválido. Debe incluir puntos y guion',
    },
  ],
  yearOfBirth: [
    { errorName: 'required', output: 'La edad es requerida' },
    {
      errorName: 'min',
      output: 'El año de nacimiento no puede ser menor a 1900',
    },
    {
      errorName: 'max',
      output: 'El año de nacimiento no puede ser mayor al año actual',
    },
  ],
  password: [
    { errorName: 'required', output: 'El nombre completo es requerido' },
    {
      errorName: 'pattern',
      output:
        'La contraseña solo debe incluir palabras, numeros o signos de puntuacion',
    },
  ],
  passwordConfirm: [
    { errorName: 'required', output: 'El nombre completo es requerido' },
    {
      errorName: 'notMatchingPassword',
      output: 'Las contraseñas no coinciden',
    },
  ],
  phoneNumber: [
    { errorName: 'required', output: 'El numero telefonico es requerido' },
    {
      errorName: 'minLength',
      output: 'El numero telefonico debe contener al menos 9 digitos',
    },
  ],
  previousDiagnostics: [
    {
      errorName: 'pattern',
      output:
        'Los diagnosticos solo pueden contener palabras, espacios y signos de puntuacion',
    },
  ],
  goals: [
    {
      errorName: 'pattern',
      output:
        'Las metas solo debe incluir palabras, numeros o signos de puntuacion',
    },
  ],
};

// custom validator for the password group
function doPasswordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const passwordMatch = control.get('passwordConfirm')?.value;
    return password === passwordMatch ? null : { notMatchingPassword: true };
  };
}
