import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { shareReplay } from 'rxjs';
import { User } from 'softwareproject-common';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public loggedIn = false;
  public authChecked = false;


  constructor(private http: HttpClient) { }

  public isLoggedIn(): boolean {
    return this.loggedIn;
  }

  public checkAuth(): Observable<boolean> {
    const authObservable: Observable<boolean> = this.http.get<boolean>('/api/auth').pipe(shareReplay());
    authObservable.subscribe({
      next: (val) => {
        this.loggedIn = val;
        this.authChecked = true;
      },
      error: (err) => {
        this.loggedIn = false;
        console.error(err);
      }
    });
    return authObservable;
  }



  public getUser(): Observable<User> {
    const userObservable: Observable<User> = this.http.get<User>('/api/user').pipe(shareReplay());
    userObservable.subscribe({
      error: (err) => {
        this.checkAuth();
        console.error(err);
      }
    });
    return userObservable;
  }

  public register(email: string, password: string): Observable<ResponseMessage> {
    const loginObservable = this.http.post<ResponseMessage>('/api/user', {
      email: email,
      password: password
    }).pipe(shareReplay());
    loginObservable.subscribe({
      next: () => {
        this.loggedIn = true;
      },
      error: () => {
        this.loggedIn = false;
      }
    });
    return loginObservable;
  }

  public login(email: string, password: string): Observable<ResponseMessage> {
    const loginObservable = this.http.post<ResponseMessage>('/api/login', {
      email: email,
      password: password
    }).pipe(shareReplay());
    loginObservable.subscribe({
      next: () => {
        this.loggedIn = true;
      },
      error: () => {
        this.loggedIn = false;
      }
    });
    return loginObservable;
  }

}

type ResponseMessage = {
  status: number
  message: string
}
