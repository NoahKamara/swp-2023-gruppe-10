import { Component, Input } from '@angular/core';
import { NameInfo } from 'src/app/services/about.service';

/**
 * A card for a developer working on this project, requires NameInfo
 */
@Component({
  selector: 'app-dev-profile',
  templateUrl: './dev-profile.component.html',
  styleUrls: ['./dev-profile.component.css']
})
export class DevProfileComponent {
  @Input()
  public data!: NameInfo | undefined;
}
