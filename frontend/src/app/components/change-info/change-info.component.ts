import { Component } from '@angular/core';

@Component({
  templateUrl: './change-info.component.html',
  styleUrls: ['./change-info.component.css']
})
export class ChangeInfoComponent {

  public firstname ='ExampleName';
  public lastname = 'ExampleLastName';

  save(): void {
    // Hier werden nun die zwischengespeicherten 
  }
}
