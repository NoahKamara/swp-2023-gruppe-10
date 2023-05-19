import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  constructor(private router: Router, private loginService: AuthService) {}
  logout(): void {
    this.loginService.loggedIn = false;
    this.router.navigateByUrl('/login');
  }
}
