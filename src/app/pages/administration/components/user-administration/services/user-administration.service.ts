import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { API_URL, AUTH_TOKEN_NAME } from 'src/app/constants/app-constants';
import User from 'src/models/IUser';
import { mockUsers } from './utils';

@Injectable()
export class UserAdministrationService {
  //private URL = `${API_URL}/users`;
  //private http = inject(HttpClient);
  //private token = localStorage.getItem(AUTH_TOKEN_NAME);
  private usersArray: WritableSignal<User[]> = signal([]);
  // signal holding the current user that its beign edited
  private onEditingUserId: WritableSignal<string | null> = signal(null);

  constructor() {
    this.updateUsersArray();
  }
  getOnEditingUserId() {
    return this.onEditingUserId();
  }
  setOnEditingUserId(newUserId: string | null): void {
    this.onEditingUserId.set(newUserId);
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
  getUserById(userId: string): User | undefined {
    return this.getAllUsers().find((user: User) => user.id === userId);
  }
  updateUserPaymentState(userId: string): void {
    this.usersArray.update((oldState) =>
      oldState.map((user: User) => {
        if (user.id === userId) {
          user.hasPaid = !user.hasPaid;
        }
        return user;
      }),
    );
  }
}
