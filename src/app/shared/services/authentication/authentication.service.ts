import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import {
  API_URL,
  AUTH_TOKEN_NAME,
  undefinedAuthenticationState,
} from 'src/app/constants/app-constants';
import ApiResponse from 'src/models/IApiResponse';
import { checkExistingToken, UserCredentials } from './utils';
import UserObject from 'src/models/IUserObject';
import AuthenticationState from 'src/models/IAuthenticationState';
import ResponseState from 'src/models/IApiCallState';
import AuthResponse from 'src/models/IAuthResponse';
import { ApiResponseErrorAdapter } from 'src/app/pages/login/adapter/ApiResponseErrorAdapter';
import { jwtDecodeToken } from 'src/app/pages/login/adapter/jwtTokenDecodeAdapter';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private apiUrl = ` ${API_URL}/auth`;
  private http = inject(HttpClient);
  // behavior subject for the authentication state
  private authenticationState: BehaviorSubject<AuthenticationState> =
    new BehaviorSubject<AuthenticationState>(checkExistingToken());
  public readonly authenticationState$: Observable<AuthenticationState> =
    this.authenticationState.asObservable();
  // behavior subject for the response state
  private responseState: BehaviorSubject<ResponseState> =
    new BehaviorSubject<ResponseState>({
      isLoading: false,
      isComplete: false,
    });
  public readonly resposeState$: Observable<ResponseState> =
    this.responseState.asObservable();

  login(credentials: UserCredentials): void {
    // update the state to start the loading animations and interactions
    this.responseState.next({
      isLoading: true,
      isComplete: false,
    });
    this.authenticationState.next({
      ...undefinedAuthenticationState,
    });
    // hit the endpoint
    this.http
      .post<ApiResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        finalize(() =>
          this.responseState.next({
            isLoading: false,
            isComplete: true,
          }),
        ),
      )
      .subscribe({
        next: (response: ApiResponse) => {
          const data = response.data as AuthResponse;
          const parseToken = jwtDecodeToken(data.token);
          this.authenticationState.next(parseToken);
          localStorage.setItem(AUTH_TOKEN_NAME, data.token);
        },
        error: (response) => {
          const errorResponse = ApiResponseErrorAdapter(response);
          switch (errorResponse.statusCode) {
            case 401: // Unauthorize, credentials are wrong
              this.authenticationState.next({
                ...undefinedAuthenticationState,
                error: 'wrongCredentials',
              });
              break;
            case 400: // Bad Request
              this.authenticationState.next({
                ...undefinedAuthenticationState,
                error: 'wrongCredentials',
              });
              break;
            case 409: // Conflict, email is not verified
              this.authenticationState.next({
                ...undefinedAuthenticationState,
                error: 'emailIsNotConfirmed',
              });
              break;
            // TODO: handle other possible errors related with server issues
            default:
              this.authenticationState.next({
                ...undefinedAuthenticationState,
              });
          }
          localStorage.removeItem(AUTH_TOKEN_NAME);
        },
      });
  }
  register(newUser: UserObject) {
    return this.http.post<ApiResponse>(`${this.apiUrl}/register`, newUser);
  }
  logout() {
    localStorage.removeItem(AUTH_TOKEN_NAME);
    this.authenticationState.next({ ...undefinedAuthenticationState });
  }
}
