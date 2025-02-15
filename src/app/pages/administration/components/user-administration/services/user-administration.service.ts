import { Injectable, signal, WritableSignal } from '@angular/core';
import User from 'src/models/IUser';
import { mockUsers } from './utils';

@Injectable({
  providedIn: 'root',
})
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
    console.log(toChange);
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
