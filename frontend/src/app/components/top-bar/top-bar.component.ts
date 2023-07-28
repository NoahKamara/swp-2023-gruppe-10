import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent {
  @Input()
  public title!: string;

  @Input()
  public showBackBtn = true;

  constructor(private router: Router, private location: Location) { }

  didClickBackBtn(): void {
    const oldPath = this.location.path;
    this.location.back();
    console.info('navigate', `${oldPath} > ${this.location.path}`);
  }
}
