import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize, map, Observable, tap } from 'rxjs';
import { API_URL, NOT_AUTHENTICATED } from 'src/app/constants/app-constants';
import ApiResponse from 'src/models/IApiResponse';
import { ApiResponseAdapter } from '../../../pages/login/adapter/ApiResponseAdapter';
import AuthResponse from 'src/models/IAuthResponse';
import AuthenticationState from 'src/models/IAuthenticationState';
import ApiConnectionState from 'src/models/IApiCallState';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { jwtTokenDecodeAdapter } from '../../../pages/login/adapter/jwtTokenDecodeAdapter';
import rawDecodedToken from 'src/models/IRawDecodeToken';
import {
  JwtCustomPayload,
  undefinedAuthenticationState,
  UserCredentials,
} from './utils';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private apiUrl = ` ${API_URL}/auth/login`;
  private http = inject(HttpClient);

  login(credentials: UserCredentials): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.apiUrl, credentials).pipe();
  }
  /*
  login(credentials: UserCredentials) {
    this.authenticationServerConnectionState.set({
      ...this.authenticationServerConnectionState(),
      isLoading: true,
    });

    setTimeout(() => {
      this.http
        .post<ApiResponse>(this.apiUrl, credentials)
        .pipe(
          map((response: ApiResponse) => ApiResponseAdapter(response)),
          finalize(() =>
            this.authenticationServerConnectionState.set({
              isLoading: false,
              connectionFinish: true,
            }),
          ),
        )
        .subscribe((response) => {
          const data = response.data as AuthResponse;
          // if response is ok = 200 save the token otherwise remove it
          if (response.statusCode === 200) {
            localStorage.setItem(this.localStorageTokenName, data.token);
            this.authenticationState.set({
              ...this.jwtDecodeToken(data.token),
            });
          } else {
            localStorage.removeItem(this.localStorageTokenName);
            this.authenticationState.set({ ...undefinedAuthenticationState });
          }
          this.authenticationServerConnectionState.set({
            ...this.authenticationServerConnectionState(),
          });
        });
    }, 2000);
    return this.getAuthenticationState().role;
  }
  */
  jwtDecodeToken(token: string): AuthenticationState {
    try {
      const decodedToken = jwtDecode(token);
      return jwtTokenDecodeAdapter(decodedToken as JwtCustomPayload);
    } catch (error) {
      throw new Error('error while trying to parse jwt token');
    }
  }
}
