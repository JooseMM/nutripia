import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import User from 'src/models/IUser';
import { API_URL, AUTH_TOKEN_NAME } from 'src/app/constants/app-constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseTrackerService } from 'src/app/shared/services/response-tracker/response-tracker.service';
import { finalize } from 'rxjs';
import ApiResponse from 'src/models/IApiResponse';

@Injectable({
  providedIn: 'root',
})
export class UserAdministrationService {
  private URL = `${API_URL}/users`;
  private http = inject(HttpClient);
  private usersArray: WritableSignal<User[]> = signal([]);
  // signal holding the current user that its beign edited
  private userBeingEdited: WritableSignal<User | null> = signal(null);
  // response tracking service
  private responseTrackerService = inject(ResponseTrackerService);

  getUserBeingEdited() {
    return this.userBeingEdited();
  }
  startEditingUser(user: User | null): void {
    this.userBeingEdited.set(user);
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
    this.startEditingUser(null);
  }
  refreshUserArray(): void {
    const token = localStorage.getItem(AUTH_TOKEN_NAME);
    if (!token) {
      throw new Error(
        'No posee las credenciales necesarias para realizar esta operacion',
      );
    }
    this.responseTrackerService.setResponseState(true, false);

    this.http
      .get<ApiResponse>(this.URL)
      .pipe(
        finalize(() =>
          this.responseTrackerService.setResponseState(false, true),
        ),
      )
      .subscribe((response: ApiResponse) => {
        this.usersArray.set(response.data as User[]);
      });
  }
  getAllUsers() {
    return this.usersArray();
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
    const userToUpdate: User[] = this.usersArray().filter(
      (user: User) => user.markedForChange,
    );

    this.responseTrackerService.setResponseState(true, false);
    this.http
      .put<ApiResponse>(this.URL, userToUpdate)
      .pipe(
        finalize(() =>
          this.responseTrackerService.setResponseState(false, true),
        ),
      )
      .subscribe((response: ApiResponse) => {
        if (response.isSuccess) {
          this.usersArray.update((userList) =>
            userList.map((user) => {
              if (user.markedForChange) {
                user.markedForChange = false;
              }
              return user;
            }),
          );
        }
      });
  }
}
