import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent {
  public isFavorite = false;
  @Input()
  public title!: string;

  @Input()
  public showBackBtn = true;

  constructor(private router: Router, private location: Location) { }

  didClickBackBtn(): void {
    console.info('going back', this.location);
    this.location.back();
  }
}
