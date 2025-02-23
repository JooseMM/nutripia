import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { finalize } from 'rxjs';
import {
  API_URL,
  AUTH_TOKEN_NAME,
  undefinedAuthenticationState,
} from 'src/app/constants/app-constants';
import ApiResponse from 'src/models/IApiResponse';
import {
  checkExistingToken,
  handleFailedUserLogin,
  handleSuccessfulUserLogin,
  UserCredentials,
} from './utils';
import AuthenticationState from 'src/models/IAuthenticationState';
import NewClient from 'src/models/INewClient';
import { ResponseTrackerService } from '../response-tracker/response-tracker.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private apiUrl = ` ${API_URL}/auth`;
  private http = inject(HttpClient);
  private responseTrackerService = inject(ResponseTrackerService);
  private authenticationState: WritableSignal<AuthenticationState> =
    signal(checkExistingToken());

  getAuthenticationState() {
    return this.authenticationState();
  }
  login(credentials: UserCredentials): void {
    // update the state to start the loading animations and interactions
    this.responseTrackerService.setResponseState(true, false);
    this.authenticationState.set({
      ...undefinedAuthenticationState,
    });
    // hit the endpoint
    this.http
      .post<ApiResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        finalize(() =>
          this.responseTrackerService.setResponseState(false, true),
        ),
      )
      .subscribe({
        next: (response: ApiResponse) => {
          handleSuccessfulUserLogin(response, this.authenticationState.set);
        },
        error: (response: HttpErrorResponse) => {
          handleFailedUserLogin(response, this.authenticationState.set);
        },
      });
  }
  register(newUser: NewClient) {
    return this.http
      .post<ApiResponse>(`${this.apiUrl}/register`, newUser)
      .pipe(
        finalize(() =>
          this.responseTrackerService.setResponseState(true, false),
        ),
      );
  }
  logout() {
    localStorage.removeItem(AUTH_TOKEN_NAME);
    this.authenticationState.set({ ...undefinedAuthenticationState });
  }

  TryToConfirmEmail(userId: string, token: string): boolean {
    // decode both params
    const requestBody = {
      userId: decodeURIComponent(userId),
      confirmationToken: decodeURIComponent(token),
    };
    let isEmailConfirmed = false;
    this.responseTrackerService.setResponseState(true, false);
    this.http
      .post<ApiResponse>(`${this.apiUrl}/email-confirmation`, requestBody)
      .pipe(
        finalize(() =>
          this.responseTrackerService.setResponseState(false, true),
        ),
      )
      .subscribe({
        next: (response: ApiResponse) => {
          handleSuccessfulUserLogin(response, this.authenticationState.set);
          isEmailConfirmed = true;
        },
        error: (response: HttpErrorResponse) => console.log(response),
      });
    return isEmailConfirmed;
  }
}
