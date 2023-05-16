import { Component, OnInit } from '@angular/core';
import { AboutService, NameInfo } from 'src/app/services/about.service';

@Component({
  selector: 'app-niklas-groene',
  templateUrl: './niklas-groene.component.html',
  styleUrls: ['./niklas-groene.component.css']
})
export class NiklasGroeneComponent{

  public myName?: NameInfo;
  
  constructor(
    private aboutService: AboutService) {}

  ngOnInit(): void {
    this.aboutService.getNiklasGroene().subscribe({
      // next: Unser Wert kam erfolgreich an!
      next: (val) => {
        this.myName = val;
      },

      // error: Es gab einen Fehler
      error: (err) => {
        console.error(err);
        this.myName = {
          firstName: 'Error!',
          lastName: 'Error!'
        };
      }
    });
  }
}
