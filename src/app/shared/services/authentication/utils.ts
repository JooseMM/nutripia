import { JwtPayload } from 'jwt-decode';
import {
  AUTH_TOKEN_NAME,
  undefinedAuthenticationState,
} from 'src/app/constants/app-constants';
import { jwtDecodeToken } from 'src/app/pages/login/adapter/jwtTokenDecodeAdapter';
import AuthenticationState from 'src/models/IAuthenticationState';
import rawDecodedToken from 'src/models/IRawDecodeToken';

export interface UserCredentials {
  email: string;
  password: string;
}
export type JwtCustomPayload = JwtPayload & rawDecodedToken;

export const checkExistingToken = (): AuthenticationState => {
  const currentAuthenticationToken = localStorage.getItem(AUTH_TOKEN_NAME);

  // check if there is a token in user localstorage
  if (currentAuthenticationToken) {
    // if true parse it and return a valid AuthenticationState
    return jwtDecodeToken(currentAuthenticationToken);
  }
  // if false parse it and return a undefined AuthenticationState
  return { ...undefinedAuthenticationState };
};
