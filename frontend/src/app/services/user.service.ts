import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { PublicUser } from 'softwareproject-common';
import { UserAddress, UserName } from 'softwareproject-common/dist/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  public getUser(): Observable<PublicUser> {
    const userObservable: Observable<PublicUser> = this.http.get<PublicUser>('/api/user').pipe(shareReplay());
    userObservable.subscribe({
      error: (err) => {
        console.error(err);
      }
    });
    return userObservable;
  }

  public updateName({ firstName, lastName }: UserName): Observable<PublicUser> {
    const body: UserName = { firstName: firstName, lastName: lastName };

    const observable: Observable<PublicUser> = this.http.patch<PublicUser>('/api/user/name', body);

    observable.subscribe({
      error: (err) => {
        console.error(err);
      }
    });

    return observable;
  }

  public updateAddress({ street, number, city, zipcode }: UserAddress): Observable<PublicUser> {
    const observable: Observable<PublicUser> = this.http.patch<PublicUser>('/api/user/address', { street, number, city, zipcode });

    observable.subscribe({
      error: (err) => {
        console.error(err);
      }
    });

    return observable;
  }

  public updatePassword({ oldPassword, newPassword }: {oldPassword: string, newPassword: string}): Observable<PublicUser> {
    const observable: Observable<PublicUser> = this.http.patch<PublicUser>('/api/user/password', { oldPassword, newPassword });

    observable.subscribe({
      error: (err) => {
        console.error(err);
      }
    });

    return observable;
  }
}
