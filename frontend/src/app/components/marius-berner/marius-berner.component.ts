import { Component } from '@angular/core';
import { AboutService, NameInfo } from 'src/app/services/about.service';

@Component({
  selector: 'app-marius-berner',
  templateUrl: './marius-berner.component.html',
  styleUrls: ['./marius-berner.component.css']
})
export class MariusBernerComponent {

 public myName?: NameInfo;
  
 constructor(
   private aboutService: AboutService) {

 }

 ngOnInit(): void {
  
   this.aboutService.getFirstLastName().subscribe({
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
