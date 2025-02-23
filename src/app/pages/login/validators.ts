import { ValidationError } from 'src/models/IValidationError';
/*
 * Validation output for the email and password
 */

interface LoginValidationErrorObject {
  email: ValidationError[];
  password: ValidationError[];
}
export const validationError: LoginValidationErrorObject = {
  email: [
    { errorName: 'required', output: 'El email es requerido' },
    {
      errorName: 'email',
      output: 'Formato de email invalido',
    },
    {
      errorName: 'emailIsNotConfirmed',
      output:
        'El correo electronico no ha sido confirmado, por favor revisa la bandeja de entrada en tu correo',
    },
  ],
  password: [
    { errorName: 'required', output: 'La contraseña es requerida' },
    {
      errorName: 'pattern',
      output:
        'La contraseña solo debe incluir palabras, numeros o signos de puntuacion',
    },
    {
      errorName: 'wrongCredentials',
      output: 'Contraseña incorrecta',
    },
  ],
};
