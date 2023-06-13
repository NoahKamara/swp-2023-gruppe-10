import { Location } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserName } from 'softwareproject-common/dist/user';
import { UserService } from 'src/app/services/user.service';

interface EditProfileFormGroup {
  firstName: FormControl<string | null>
  lastName: FormControl<string | null>
}


@Component({
  templateUrl: './edit-profile-name.component.html',
  styleUrls: ['./edit-profile-name.component.css']
})
export class EditProfileNameComponent implements OnInit {
  public formGroup = new FormGroup<EditProfileFormGroup>({
    firstName: new FormControl<string>('Max', [Validators.required]),
    lastName: new FormControl<string>('Mustermann', [Validators.required]),
  });

  @Input()
  public didCancel = (): void => {
    console.warn('didCancel was not injected');
  };

  constructor(
    private location: Location,
    @Inject(MAT_DIALOG_DATA)
    public data: UserName,
    private userService: UserService,
    private dialogRef: MatDialogRef<EditProfileNameComponent>
  ) { }

  ngOnInit(): void {
    // this.firstNameCtrl.setValue(this.data.firstName);
    // this.lastNameCtrl.setValue(this.data.lastName);
    this.formGroup.setValue(this.data);
  }

  didSubmit(): void {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.invalid) return;

    const values = this.formGroup.value;

    this.userService
      .updateName({ firstName: values.firstName ?? '', lastName: values.lastName ?? '' })
      .subscribe({
        next: () => {
          this.dialogRef.close();
        }
      });
  }
}
