import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent {
  @Input()
  public title!: string;

  @Input()
  public backURL?: string = '..';

  constructor(private router: Router) { }

  pop(): void {
    if (!this.backURL) return;

    this.router.navigateByUrl(this.backURL);
  }
}
