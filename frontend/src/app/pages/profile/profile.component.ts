import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PublicUser } from 'softwareproject-common';
import { AuthService } from 'src/app/services/auth.service';
import { EditProfileNameComponent } from '../edit-profile-name/edit-profile-name.component';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileAddressComponent } from '../edit-profile-address/edit-profile-address.component';
import { EditProfilePasswordComponent } from '../edit-profile-password/edit-profile-password.component';
import { UserService } from 'src/app/services/user.service';


const dialogConfig = {
  disableClose: true,
  height: '400px',
  width: '300px',
};

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public user: PublicUser | null = null;

  constructor(private router: Router, private authService: AuthService, private userService: UserService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigateByUrl('/login');
    });
  }


  openEditNameModal(): void {
    if (!this.user) return;

    const ref = this.dialog.open(EditProfileNameComponent, {
      ...dialogConfig,
      data: {
        firstName: this.user.firstName,
        lastName: this.user.lastName
      }
    });
    ref.afterClosed().subscribe(() => this.loadUserData());
  }

  openEditAddressModal(): void {
    if (!this.user) return;

    const ref = this.dialog.open(EditProfileAddressComponent, {
      ...dialogConfig,
      data: {
        street: this.user.street,
        number: this.user.number,
        city: this.user.city,
        zipcode: this.user.zipcode,
      }
    });
    ref.afterClosed().subscribe(() => this.loadUserData());
  }

  openEditPasswordModal(): void {
    if (!this.user) return;

    const ref = this.dialog.open(EditProfilePasswordComponent, { ...dialogConfig });
    ref.afterClosed().subscribe(() => this.loadUserData());
  }

  /**
   * load user data and update variable
   */
  loadUserData(): void {
    this.userService.getUser().subscribe({
      next: user => {
        this.user = user;
      }
    });
  }
}
