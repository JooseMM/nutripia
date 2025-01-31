import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { API_URL } from 'src/app/constants/app-constants';
import ApiResponse from 'src/models/IApiResponse';
import { ApiResponseAdapter } from '../adapter/ApiResponseAdapter';
import AuthResponse from 'src/models/IAuthResponse';

interface UserCredentials {
  email: string;
  password: string;
}
interface AuthState {
  name: string;
  token: string;
  email: string;
  isEmailConfirmed: boolean;
  serverConnectionSuccess: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private apiUrl = ` ${API_URL}/auth/login`;
  private http = inject(HttpClient);

  state = signal<AuthState>({
    name: '',
    token: '',
    email: '',
    isEmailConfirmed: false,
    serverConnectionSuccess: false,
  });

  getState() {
    return this.state();
  }
  login(credentials: UserCredentials) {
    this.http
      .post<ApiResponse>(this.apiUrl, credentials)
      .pipe(
        map((response: ApiResponse) => ApiResponseAdapter(response)),
        tap((response) => console.log(response)),
      )
      .subscribe((response) => {
        if (response.isSuccess) {
          const authentication: AuthResponse = response.data as AuthResponse;

          this.state.set({ ...authentication, serverConnectionSuccess: true });
        }
      });
  }
}
