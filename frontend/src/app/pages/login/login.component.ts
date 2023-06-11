import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


interface LoginFormGroup {
  email: FormControl<string | null>
  password: FormControl<string | null>
}

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public formGroup = new FormGroup<LoginFormGroup>({
    email: new FormControl<string>('max.mustermann@email.com', [Validators.required, Validators.email]),
    password: new FormControl<string>('max.mustermann@email.com', [Validators.required]),
  });

  public errorMsg: string | undefined;
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.checkAuth().subscribe(res => {
      console.log('CHECK');
      if (res) this.router.navigateByUrl('/map');
    });
  }

  login(): void {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.invalid) return;

    const values = this.formGroup.value;
    this.authService
      .login({
        email: values.email ?? '',
        password: values.password ?? ''
      })
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/map');
        },
        error: (err) => {
          this.formGroup.setErrors({ wrongEmailOrPassword: true });
          this.errorMsg = 'Email oder Passwort inkorret';
        }
      });
  }
}
