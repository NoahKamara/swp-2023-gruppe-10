import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { shareReplay } from 'rxjs';
import { APIError } from 'softwareproject-common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public loggedIn = false;

  constructor(private http: HttpClient) {}

  public isLoggedIn(): boolean {
    return this.loggedIn;
  }

  public checkAuth(): Observable<boolean> {
    const authObservable: Observable<boolean> = this.http.get<boolean>('/api/auth')
      .pipe(shareReplay())
      .pipe(map(() => true))
      .pipe(catchError(async () => {
        console.log('ERROR');
        return false;
      }));

    authObservable.subscribe({
      next: isAuthenticated => {
        console.info('auth:', isAuthenticated);
        this.loggedIn = isAuthenticated;
      }
    });

    return authObservable;
  }

  /**
  * Create new user with data
  */
  public register({ firstname, lastname, street, number, city, zipcode, email, password }: { firstname: string; lastname: string; street: string; number: string; city: string; zipcode: string; email: string; password: string; }): Observable<ResponseMessage> {
    const authObservable = this.http.post<ResponseMessage>('/api/user', {
      firstName: firstname,
      lastName: lastname,
      street: street,
      number: number,
      city: city,
      zipcode: zipcode,
      email: email,
      password: password
    }).pipe(shareReplay());
    authObservable.subscribe({
      next: (response) => {
        console.info('register succeeded', response);
        this.loggedIn = true;
      },
      error: (err: HttpErrorResponse) => {
        console.error(`register failed: (${err.error.code}) ${err.error.message}`);
        this.loggedIn = false;
      }
    });
    return authObservable;
  }

  /**
  * login existing user
  */
  public login({ email, password }: { email: string; password: string; }): Observable<ResponseMessage> {
    const authObservable = this.http.post<ResponseMessage>('/api/session', {
      email: email,
      password: password
    }).pipe(shareReplay());
    authObservable.subscribe({
      next: () => {
        console.info('login succeeded');
        this.loggedIn = true;
      },
      error: (err: APIError) => {
        console.error(`login failed: (${err.code}) ${err.error}`);
        this.loggedIn = false;
      }
    });
    return authObservable;
  }

  /**
    * Log out the currently signed in user
    */
  public logout(): Observable<ResponseMessage> {
    const authObservable = this.http.delete<ResponseMessage>('/api/session').pipe(shareReplay());
    authObservable.subscribe({
      next: (response) => {
        console.info('logout succeeded', response);
        this.loggedIn = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error(`logout failed: (${err.error.code}) ${err.error.message}`);
      }
    });
    return authObservable;
  }
}

type ResponseMessage = {
  status: number
  message: string
}
