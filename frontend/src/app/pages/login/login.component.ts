import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public email = '';
  public password = '';

  constructor(private router: Router, private loginService: LoginService) {}

  login(): void {
    // Diese Funktion muss in Sprint 1 selbst implementiert werden!
    // Die jetztige implementierug ist nur ein Beispiel damit der Prototyp interaktiv funktioniert.
    this.loginService.loggedIn = true;
    this.router.navigateByUrl('/map');
  }
}
