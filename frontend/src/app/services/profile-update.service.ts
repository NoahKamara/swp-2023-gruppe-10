import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileUpdateService {
  public verifyPW = '';
  public globalFirstname ='ExampleName';
  public globalLastname = 'ExampleLastName';
  public globalStreet = 'ExampleStreet';
  public globalNummer = '1';
  public globalPlz = '78464';
  public globalOrt = 'Konstanz';


  constructor() { }
}
