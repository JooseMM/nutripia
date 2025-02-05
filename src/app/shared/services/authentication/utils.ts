import { JwtPayload } from 'jwt-decode';
import AuthenticationState from 'src/models/IAuthenticationState';
import rawDecodedToken from 'src/models/IRawDecodeToken';

export interface UserCredentials {
  email: string;
  password: string;
}
export const undefinedAuthenticationState: AuthenticationState = {
  email: '',
  firstName: '',
  isEmailVerified: false,
  role: '',
};
export type JwtCustomPayload = JwtPayload & rawDecodedToken;
