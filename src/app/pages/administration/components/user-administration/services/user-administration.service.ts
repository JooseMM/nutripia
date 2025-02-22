import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import User from 'src/models/IUser';
import { mockUsers } from './utils';
import { API_URL, AUTH_TOKEN_NAME } from 'src/app/constants/app-constants';
import { HttpClient } from '@angular/common/http';
import { ResponseTrackerService } from 'src/app/shared/services/response-tracker/response-tracker.service';
import { finalize } from 'rxjs';
import ApiResponse from 'src/models/IApiResponse';

@Injectable({
  providedIn: 'root',
})
export class UserAdministrationService {
  private URL = `${API_URL}/users`;
  private http = inject(HttpClient);
  private token = localStorage.getItem(AUTH_TOKEN_NAME);
  private usersArray: WritableSignal<User[]> = signal([]);
  // signal holding the current user that its beign edited
  private onEditingUserId: WritableSignal<string | null> = signal(null);
  // response tracking service
  private responseTrackerService = inject(ResponseTrackerService);

  constructor() {
    this.updateUsersArray();
  }
  getOnEditingUserId() {
    return this.onEditingUserId();
  }
  setOnEditingUserId(newUserId: string | null): void {
    this.onEditingUserId.set(newUserId);
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
      .post<ApiResponse>(this.URL, requestBody)
      .pipe(
        finalize(() =>
          this.responseTrackerService.setResponseState(false, true),
        ),
      )
      .subscribe({
        next: (response: ApiResponse) => {
          if (response.isSuccess) {
            isEmailConfirmed = true;
          }
        },
      });
    return isEmailConfirmed;
  }
  updateUser(newUserData: User): void {
    this.usersArray.update((prev) => {
      return prev.map((user: User) => {
        if (user.id === newUserData.id) {
          user = { ...newUserData, markedForChange: true };
        }
        return user;
      });
    });
    this.setOnEditingUserId(null);
  }
  updateUsersArray(): void {
    /*
    if (this.token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
      });
      this.http.get(this.URL, { headers });
    }
    */
    return this.usersArray.set([...mockUsers]);
  }
  getAllUsers() {
    return this.usersArray();
  }
  getAllUsersId(): string[] {
    return this.getAllUsers().map((user) => user.id);
  }
  updateUserPaymentState(userId: string): void {
    this.usersArray.update((oldState) =>
      oldState.map((user: User) => {
        if (user.id === userId) {
          user.hasPaid = !user.hasPaid;
          user.markedForChange = true;
        }
        return user;
      }),
    );
  }
  saveChanges(): void {
    const toChange: User[] = this.usersArray().filter(
      (user: User) => user.markedForChange,
    );
    this.usersArray.update((prev) =>
      prev.map((user: User) => {
        if (user.markedForChange) {
          user.markedForChange = false;
        }
        return user;
      }),
    );
  }
}
