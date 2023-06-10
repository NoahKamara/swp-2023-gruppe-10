import { Component, Input } from '@angular/core';
import { NameInfo } from 'src/app/services/about.service';

@Component({
  selector: 'app-dev-profile',
  templateUrl: './dev-profile.component.html',
  styleUrls: ['./dev-profile.component.css']
})
export class DevProfileComponent {
  @Input()
  public data!: NameInfo | undefined;
}
