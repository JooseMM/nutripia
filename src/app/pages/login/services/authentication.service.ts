import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { finalize, map, tap } from 'rxjs';
import { API_URL } from 'src/app/constants/app-constants';
import ApiResponse from 'src/models/IApiResponse';
import { ApiResponseAdapter } from '../adapter/ApiResponseAdapter';
import AuthResponse from 'src/models/IAuthResponse';
import AuthenticationState from 'src/models/IAuthenticationState';
import ApiConnectionState from 'src/models/IApiCallState';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { jwtTokenDecodeAdapter } from '../adapter/jwtTokenDecodeAdapter';
import rawDecodedToken from 'src/models/IRawDecodeToken';

interface UserCredentials {
  email: string;
  password: string;
}
const undefinedAuthenticationState: AuthenticationState = {
  email: '',
  firstName: '',
  isEmailVerified: false,
  role: '',
};
type JwtCustomPayload = JwtPayload & rawDecodedToken;
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private apiUrl = ` ${API_URL}/auth/login`;
  private http = inject(HttpClient);
  private localStorageTokenName = 'authToken';

  // global authentication state
  authenticationState = signal<AuthenticationState>({
    ...undefinedAuthenticationState,
  });

  // global connection state
  apiConnectionState = signal<ApiConnectionState>({
    isLoading: false,
    connectionFinish: false,
  });

  getApiConnectionState() {
    return this.apiConnectionState();
  }
  getAuthenticationState() {
    return this.authenticationState();
  }
  login(credentials: UserCredentials) {
    this.apiConnectionState.set({
      ...this.apiConnectionState(),
      isLoading: true,
    });

    this.http
      .post<ApiResponse>(this.apiUrl, credentials)
      .pipe(
        map((response: ApiResponse) => ApiResponseAdapter(response)),
        finalize(() =>
          this.apiConnectionState.set({
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
          this.authenticationState.set(this.jwtDecodeToken(data.token));
        } else {
          localStorage.removeItem(this.localStorageTokenName);
        }
      });
  }
  jwtDecodeToken(token: string): AuthenticationState {
    try {
      const decodedToken = jwtDecode(token);
      return jwtTokenDecodeAdapter(decodedToken as JwtCustomPayload);
    } catch (error) {
      this.authenticationState.set({ ...undefinedAuthenticationState });
      localStorage.removeItem(this.localStorageTokenName);
      throw new Error('error while trying to parse jwt token');
    }
  }
}
