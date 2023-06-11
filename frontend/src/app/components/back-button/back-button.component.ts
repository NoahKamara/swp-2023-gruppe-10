import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.css']
})
export class BackButtonComponent {
  constructor(private location: Location) {}

  didClick(): void {
    console.log('go back');
    this.location.back();
  }
}
