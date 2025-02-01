import { JwtPayload } from 'jwt-decode';
import AuthenticationState from 'src/models/IAuthenticationState';
import AuthResponse from 'src/models/IAuthResponse';
import rawDecodedToken from 'src/models/IRawDecodeToken';

// to handle the library parsing booleans to strings using PascalCase
const parseBoolean = (bool: string): boolean => {
  return bool === 'true' || bool === 'True';
};

export const jwtTokenDecodeAdapter = (
  token: JwtPayload & rawDecodedToken,
): AuthenticationState => {
  return {
    email: token.email,
    firstName: token.name,
    isEmailVerified: parseBoolean(token.email_verified),
    role: token.user_role,
  };
};
