import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserInfo } from 'softwareproject-common';
import { AuthService } from 'src/app/services/auth.service';


const matchPasswords: ValidatorFn = (controls: AbstractControl) => {
  const control = controls.get('password');
  const matchControl = controls.get('passwordConfirm');

  console.log(control, matchControl);
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
    town: FormControl<string|null>
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
export class RegisterComponent {
  public formGroup = new FormGroup<RegisterFormGroup>({
    firstName: new FormControl<string>(''),
    lastName: new FormControl<string>(''),
    street: new FormControl<string>(''),
    number: new FormControl<string>(''),
    town: new FormControl<string>(''),
    zipcode: new FormControl<string>(''),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(8)]),
    passwordConfirm: new FormControl<string>('', [Validators.required])
  }, {
    validators: matchPasswords
  });

  public errorMsg: string | undefined;
  constructor(private router: Router, private authService: AuthService) { }

  register(): void {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.invalid) return;

    const values = this.formGroup.value;
    this.authService
      .register(values.firstName ?? '', values.lastName ?? '', values.email ?? '', values.password ?? '')
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/map');
        },
        error: (err) => {
          console.error(err);
          this.errorMsg = err.error.message;
        }
      });
  }
}
