import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserAddress } from 'softwareproject-common';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

interface EditAddressFormGroup {
  street: FormControl<string|null>
  number: FormControl<string|null>
  city: FormControl<string|null>
  zipcode: FormControl<string|null>
}
@Component({
  selector: 'app-edit-profile-address',
  templateUrl: './edit-profile-address.component.html',
  styleUrls: ['./edit-profile-address.component.css']
})
export class EditProfileAddressComponent implements OnInit {
  public formGroup = new FormGroup<EditAddressFormGroup>({
    street: new FormControl<string>('Musterweg', [Validators.required]),
    number: new FormControl<string>('4', [Validators.required]),
    city: new FormControl<string>('Musterstadt', [Validators.required]),
    zipcode: new FormControl<string>('12345', [Validators.required]),
  });

  @Input()
  public didCancel = (): void => {
    console.warn('didCancel was not injected');
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: UserAddress, private userService: UserService, private dialogRef: MatDialogRef<EditAddressFormGroup>) {}

  ngOnInit(): void {
    this.formGroup.setValue(this.data);
  }

  didSubmit(): void {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.invalid) return;

    const values = this.formGroup.value;

    this.userService
      .updateAddress({
        street: values.street ?? '',
        number: values.number ?? '',
        zipcode: values.zipcode ?? '',
        city: values.city ?? '',
       })
      .subscribe({
        next: () => {
          this.dialogRef.close();
        }
      });
  }
}
