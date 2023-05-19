import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  constructor(private router: Router, private loginService: LoginService) {}
  logout(): void {
    this.loginService.loggedIn = false;
    this.router.navigateByUrl('/login');
  }
}
