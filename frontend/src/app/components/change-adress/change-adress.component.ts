import { Component } from '@angular/core';

@Component({
  templateUrl: './change-adress.component.html',
  styleUrls: ['./change-adress.component.css']
})
export class ChangeAdressComponent {

  public street = 'ExampleStreet';
  public nummer = '1';
  public plz = '78464';
  public ort = 'Konstanz';
  
  save(): void {
    // Bitte Logik einfügen
  }

}
