import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, finalize, map, Observable, tap } from 'rxjs';
import { API_URL, NOT_AUTHENTICATED } from 'src/app/constants/app-constants';
import ApiResponse from 'src/models/IApiResponse';
import { undefinedAuthenticationState, UserCredentials } from './utils';
import UserObject from 'src/models/IUserObject';
import AuthenticationState from 'src/models/IAuthenticationState';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private apiUrl = ` ${API_URL}/auth`;
  private http = inject(HttpClient);
  private stateSubjet: BehaviorSubject<AuthenticationState> =
    new BehaviorSubject<AuthenticationState>({
      ...undefinedAuthenticationState,
    });
  public readonly state$: Observable<AuthenticationState> =
    this.stateSubjet.asObservable();
  login(credentials: UserCredentials): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/login`, credentials);
  }
  register(newUser: UserObject) {
    return this.http.post<ApiResponse>(`${this.apiUrl}/register`, newUser);
  }
}
