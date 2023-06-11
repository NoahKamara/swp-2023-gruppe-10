import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


const matchPasswords: ValidatorFn = (controls: AbstractControl) => {
  const control = controls.get('password');
  const matchControl = controls.get('passwordConfirm');

  if (!matchControl?.errors && control?.value !== matchControl?.value) {
    matchControl?.setErrors({
      matching: {
        actualValue: matchControl?.value,
        requiredValue: control?.value
      }
    });
    return { matching: true };
  }
  return null;
};

interface RegisterFormGroup {
  firstName: FormControl<string|null>
    lastName: FormControl<string|null>
    street: FormControl<string|null>
    number: FormControl<string|null>
    city: FormControl<string|null>
    zipcode: FormControl<string|null>
    email: FormControl<string|null>
    password: FormControl<string|null>
    passwordConfirm: FormControl<string|null>
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  public formGroup = new FormGroup<RegisterFormGroup>({
    firstName: new FormControl<string>('Max', [Validators.required]),
    lastName: new FormControl<string>('Mustermann', [Validators.required]),
    street: new FormControl<string>('Musterweg', [Validators.required]),
    number: new FormControl<string>('4', [Validators.required]),
    city: new FormControl<string>('Musterstadt', [Validators.required]),
    zipcode: new FormControl<string>('12345', [Validators.required]),
    email: new FormControl<string>('max.mustermann@email.com', [Validators.required, Validators.email]),
    password: new FormControl<string>('max.mustermann@email.com', [Validators.required, Validators.minLength(8)]),
    passwordConfirm: new FormControl<string>('max.mustermann@email.com', [Validators.required])
  }, {
    validators: matchPasswords
  });

  public errorMsg: string | undefined;
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.checkAuth().subscribe(isAuth => {
      if (isAuth) this.router.navigateByUrl('/map');
    });
  }

  register(): void {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.invalid) return;

    const values = this.formGroup.value;
    this.authService
      .register({
        firstname: values.firstName ?? '',
        lastname: values.lastName ?? '',
        street: values.street ?? '',
        number: values.number ?? '',
        city: values.city ?? '',
        zipcode: values.zipcode ?? '',
        email: values.email ?? '',
        password: values.password ?? '' })
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/map');
        },
        error: (err) => {
          console.error(err);
          if (err.error.message === 'Nutzer mit Email existiert bereits') {
            this.formGroup.controls.email.setErrors({
              'duplicate': true
            });
          }
          this.errorMsg = err.error.message;
        }
      });
  }
}
