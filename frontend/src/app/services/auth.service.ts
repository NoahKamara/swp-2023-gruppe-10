import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public loggedIn = false;
  public authChecked = false;


  constructor(private http: HttpClient) {
    this.http = http;
    this.checkAuth();
  }

  public isLoggedIn(): boolean {
    return this.loggedIn;
  }

  public checkAuth(): Observable<boolean> {
    const authObservable: Observable<boolean> = this.http.get<boolean>('/api/auth').pipe(shareReplay());
    authObservable.subscribe({
      next: (val) => {
        console.info('getAuth', val);
        this.loggedIn = val;
        this.authChecked = true;
      },
      error: (err) => {
        console.error('getAuth failed', err);
        this.loggedIn = false;
        console.error(err);
      }
    });
    return authObservable;
  }



  // public getUser(): Observable<User> {
  //   const userObservable: Observable<User> = this.http.get<User>('/api/user').pipe(shareReplay());
  //   userObservable.subscribe({
  //     error: (err) => {
  //       this.checkAuth();
  //       console.error(err);
  //     }
  //   });
  //   return userObservable;
  // }

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

  public login(email: string, password: string): Observable<ResponseMessage> {
    const authObservable = this.http.post<ResponseMessage>('/api/session', {
      email: email,
      password: password
    }).pipe(shareReplay());
    authObservable.subscribe({
      next: (response) => {
        console.info('login succeeded', response);
        this.loggedIn = true;
      },
      error: (err: HttpErrorResponse) => {
        console.error(`login failed: (${err.error.code}) ${err.error.message}`);
        this.loggedIn = false;
      }
    });
    return authObservable;
  }

  public logout(): Observable<ResponseMessage> {
    const authObservable = this.http.delete<ResponseMessage>('/api/session').pipe(shareReplay());
    authObservable.subscribe({
      next: (response) => {
        console.info('logout succeeded', response);
        this.authChecked = false;
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
