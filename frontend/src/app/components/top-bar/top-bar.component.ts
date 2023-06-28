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
  public showFavBtn = false;

  constructor(private router: Router, private location: Location) { }

  didClickBackBtn(): void {
    console.info('going back', this.location);
    this.location.back();
  }
  didClickFavBtn(): void{
  if(this.isFavorite === false){
  this.isFavorite = true;
  }
  else{
  this.isFavorite = false;
  }
  }
}
