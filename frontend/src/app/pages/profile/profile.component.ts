import { Component } from '@angular/core';

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  public name ='Example Name';
  public address = 'ExampleStreet 1';
  public email = 'examplemail@exp.com';
  public password = '***********';

  logout(): void {
    // Bitte Logik einfügen
  }

  getName(): string{
    return this.name;
  }
}
