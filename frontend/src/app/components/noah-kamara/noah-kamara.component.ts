import { Component, OnInit } from '@angular/core';
import { AboutService, NameInfo } from 'src/app/services/about.service';

@Component({
  selector: 'app-noah-kamara',
  templateUrl: './noah-kamara.component.html',
  styleUrls: ['./noah-kamara.component.css']
})

export class NoahKamaraComponent implements OnInit {

 public myName?: NameInfo;

 constructor(
   private aboutService: AboutService) {

 }

 ngOnInit(): void {

   this.aboutService.getNoahKamara().subscribe({
     // next: Unser Wert kam erfolgreich an!
     next: (val) => {
       this.myName = val;
     },

     // error: Es gab einen Fehler
     error: (err) => {
       console.error(err);
       this.myName = {
        firstName: 'Error!',
        lastName: 'Error!',
        semester: 'Error!',
        course: 'Error!',
        mail: 'Error!'
       };
     }
   });
 }
}
