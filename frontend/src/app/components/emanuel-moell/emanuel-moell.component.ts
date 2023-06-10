import { Component, OnInit } from '@angular/core';
import { AboutService, NameInfo } from 'src/app/services/about.service';

@Component({
  selector: 'app-emanuel-moell',
  templateUrl: './emanuel-moell.component.html',
  styleUrls: ['./emanuel-moell.component.css']
})
export class EmanuelMoellComponent implements OnInit {

  public myName?: NameInfo;

  constructor(
    private aboutService: AboutService) {

  }

  ngOnInit(): void {

    this.aboutService.getEmanuelMoell().subscribe({
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
