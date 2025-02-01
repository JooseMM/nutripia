import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { finalize, map, Observable, tap } from 'rxjs';
import { API_URL } from 'src/app/constants/app-constants';
import ApiResponse from 'src/models/IApiResponse';
import { ApiResponseAdapter } from '../adapter/ApiResponseAdapter';
import AuthResponse from 'src/models/IAuthResponse';
import AuthenticatorState from 'src/models/IAuthenticationState';
import ApiConnectionState from 'src/models/IApiCallState';

interface UserCredentials {
  email: string;
  password: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private apiUrl = ` ${API_URL}/auth/login`;
  private http = inject(HttpClient);

  authenticationState = signal<AuthenticatorState>({
    name: '',
    token: '',
    email: '',
    isEmailConfirmed: false,
  });

  apiConnectionState = signal<ApiConnectionState>({
    isLoading: false,
    serverConnectionSuccess: false,
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
        tap((response) => console.log(response)),
        finalize(() =>
          this.apiConnectionState.set({
            isLoading: false,
            serverConnectionSuccess: true,
          }),
        ),
      )
      .subscribe((response) => {
        this.authenticationState.set(response.data as AuthResponse);
      });
  }
}
