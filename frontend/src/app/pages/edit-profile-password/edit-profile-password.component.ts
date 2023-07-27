import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { matchPasswords } from '../register/register.component';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';

interface EditPasswordFormGroup {
    oldPassword: FormControl<string|null>
    newPassword: FormControl<string|null>
    newPasswordConfirm: FormControl<string|null>
}

@Component({
  selector: 'app-edit-profile-password',
  templateUrl: './edit-profile-password.component.html',
  styleUrls: ['./edit-profile-password.component.css']
})
export class EditProfilePasswordComponent {
  public formGroup = new FormGroup<EditPasswordFormGroup>({
    oldPassword: new FormControl<string>('', [Validators.required]),
    newPassword: new FormControl<string>('', [Validators.required, Validators.minLength(8)]),
    newPasswordConfirm: new FormControl<string>('', [Validators.required])
  }, { validators: matchPasswords });

  @Input()
  public didCancel = (): void => {
    console.warn('didCancel was not injected');
  };

  constructor(private userService: UserService, private dialogRef: MatDialogRef<EditPasswordFormGroup>) {}

  didSubmit(): void {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.invalid) return;

    const values = this.formGroup.value;

    this.userService
      .updatePassword({
        oldPassword: values.oldPassword ?? '',
        newPassword: values.newPassword ?? ''
       })
      .subscribe({
        next: () => {
          this.dialogRef.close();
        },
        error: () => {
          this.formGroup.controls.oldPassword.setErrors({wrong: true});
        }
      });
  }
}
