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
  ],
  password: [
    { errorName: 'required', output: 'El nombre completo es requerido' },
    {
      errorName: 'pattern',
      output:
        'La contraseña solo debe incluir palabras, numeros o signos de puntuacion',
    },
    {
      errorName: 'wrongCredentials',
      output: 'Email o Contraseña incorrecta',
    },
  ],
};
