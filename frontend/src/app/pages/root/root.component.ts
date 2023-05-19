import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

/**
 *  Die Root-Komponente stellt die "Haupt-Komponente" dar, die alle anderen Komponenten enthält.
 *  Hier können wir z.B. HTML Komponenten festlegen, die auf allen Seiten erscheinen (beispielsweise
 *  eine Navigation Bar).  In der "app.module.ts" Datei legen wir für Angular fest, dass
 *  diese Komponente die "Haupt-Komponente" ist.
 */
@Component({
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css'],
  selector: 'app-root'
})
export class RootComponent {

  constructor(public loginService: AuthService) { }

}
