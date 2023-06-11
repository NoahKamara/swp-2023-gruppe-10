import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  public name ='Example Name';
  public address = 'ExampleStreet 1';
  public email = 'examplemail@exp.com';
  public password = '***********';

  constructor(private router: Router, private authService: AuthService) {}
  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigateByUrl('/login');
    });
  }

  getName(): string{
    return this.name;
  }
}
