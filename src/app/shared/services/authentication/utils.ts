import { JwtPayload } from 'jwt-decode';
import {
  AUTH_TOKEN_NAME,
  undefinedAuthenticationState,
} from 'src/app/constants/app-constants';
import { jwtDecodeToken } from 'src/app/pages/login/adapter/jwtTokenDecodeAdapter';
import ApiResponse from 'src/models/IApiResponse';
import AuthenticationState from 'src/models/IAuthenticationState';
import AuthResponse from 'src/models/IAuthResponse';
import rawDecodedToken from 'src/models/IRawDecodeToken';
import { AuthenticationService } from './authentication.service';
import { WritableSignal } from '@angular/core';
import { ApiResponseErrorAdapter } from 'src/app/pages/login/adapter/ApiResponseErrorAdapter';
import { HttpErrorResponse } from '@angular/common/http';

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

export function handleSuccessfulUserLogin(
  response: ApiResponse,
  setAuthenticationState: (value: AuthenticationState) => void,
) {
  const data = response.data as AuthResponse;
  const parseToken = jwtDecodeToken(data.token);
  setAuthenticationState(parseToken);
  localStorage.setItem(AUTH_TOKEN_NAME, data.token);
}
export function handleFailedUserLogin(
  response: HttpErrorResponse,
  setAuthenticationState: (value: AuthenticationState) => void,
) {
  const errorResponse = ApiResponseErrorAdapter(response);
  switch (errorResponse.statusCode) {
    case 401: // Unauthorize, credentials are wrong
      setAuthenticationState({
        ...undefinedAuthenticationState,
        error: 'wrongCredentials',
      });
      break;
    case 400: // Bad Request
      setAuthenticationState({
        ...undefinedAuthenticationState,
        error: 'wrongCredentials',
      });
      break;
    case 409: // Conflict, email is not verified
      setAuthenticationState({
        ...undefinedAuthenticationState,
        error: 'emailIsNotConfirmed',
      });
      break;
    // TODO: handle other possible errors related with server issues
    default:
      setAuthenticationState({
        ...undefinedAuthenticationState,
      });
  }
  localStorage.removeItem(AUTH_TOKEN_NAME);
}
