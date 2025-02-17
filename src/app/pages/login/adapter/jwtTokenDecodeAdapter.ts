import { jwtDecode, JwtPayload } from 'jwt-decode';
import { JwtCustomPayload } from 'src/app/shared/services/authentication/utils';
import AuthenticationState from 'src/models/IAuthenticationState';
import rawDecodedToken from 'src/models/IRawDecodeToken';

// to handle the library parsing booleans to strings using PascalCase
const parseBoolean = (bool: string): boolean => {
  return bool === 'true' || bool === 'True';
};

export const jwtDecodeToken = (token: string): AuthenticationState => {
  try {
    const decodedToken = jwtDecode(token);
    return authenticationStateAdapter(decodedToken as JwtCustomPayload);
  } catch (error) {
    throw new Error('error while trying to parse jwt token');
  }
};

export const authenticationStateAdapter = (
  token: JwtPayload & rawDecodedToken,
): AuthenticationState => {
  return {
    id: token.sub!,
    email: token.email,
    fullName: token.name,
    isEmailVerified: parseBoolean(token.email_verified),
    role: token.user_role,
    error: '',
  };
};
