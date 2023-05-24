import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public email = '';
  public password = '';
  public errormessage = '';

  constructor(private router: Router, private loginService: AuthService) {}

  ngOnInit(): void {
    this.loginService.checkAuth().subscribe(res => {
      console.log('CHECK');
      if (res) this.router.navigateByUrl('/map');
    });
  }

  login(): void {
    this.loginService.login('max.mustermann@email.com', 'max.mustermann@email.com').subscribe(res => {
      console.log(res);
      this.loginService.checkAuth().subscribe(res => {
        console.log('CHECK');
        if (res) this.router.navigateByUrl('/map');
      });
    });
  }
}
