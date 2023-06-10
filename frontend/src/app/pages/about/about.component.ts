import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { AboutService, NameInfo } from 'src/app/services/about.service';


@Component({
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  public developers: NameInfo[] = [];

  constructor(private aboutService: AboutService) {}

  ngOnInit(): void {
    combineLatest([
      this.aboutService.getNoahKamara(),
      this.aboutService.getMariusBerner(),
      this.aboutService.getEmanuelMoell(),
      this.aboutService.getNiklasGroene()
    ])
      .subscribe({
        next: val => {
          this.developers = val;
        },
        error: err => {
          console.error('error loading devs', err);
        }
      });
  }
}
