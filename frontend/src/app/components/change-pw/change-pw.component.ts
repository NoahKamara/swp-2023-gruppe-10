import { Component } from '@angular/core';
import { ProfileUpdateService } from 'src/app/services/profile-update.service';

@Component({
  templateUrl: './change-pw.component.html',
  styleUrls: ['./change-pw.component.css']
})
export class ChangePwComponent {

  public oldpw = '';
  public newpw1 = '';
  public newpw2 = '';

  save(): void {
    // Bitte Logik einfügen
  }

  constructor(public profileUpdateService: ProfileUpdateService) { }


  

}
