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
    const observables = [
      this.aboutService.getNoahKamara(),
      this.aboutService.getMariusBerner(),
      // this.aboutService.getEmanuelMoell(),
      this.aboutService.getNiklasGroene()
    ]
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

    combineLatest(observables)
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
