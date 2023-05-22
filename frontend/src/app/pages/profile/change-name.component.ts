import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  templateUrl: './change-name.component.html',
  styleUrls: ['./change-name.component.css']
})
export class ChangeNameComponent{
  /**
   *  Damit der Text in der HTML Komponente bereitsteht, legen wir den Text als 'public' fest.
   */

  @Input()
  label = '';

  @Input()
  type: 'text' | 'number' | 'password' = 'text';

  @Input()
  text = '';
  @Output()
  textChange = new EventEmitter<string>();

  onTextChange(): void {
    this.textChange.emit(this.text);
  }

  /**
   *  Hier definieren wir ein Array von Objekten für Links. Damit das HTML Template (landingpage.component.html)
   *  auch Zugriff auf dieses Attribut hat, deklarieren wir es als public. Der Typ dieses Attributs definieren wir
   *  als Array [] von Objekten {}, die einen "name" String und einen "url" String haben.
   */
  public links: {name: string, url: string }[] = [
    { name: 'Overview: HTML', url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML' },
    { name: 'Overview: CSS', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS' },
    { name: 'Overview: JavaScript', url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript' },
    { name: 'Getting Started with Typescript', url: 'https://www.typescriptlang.org/docs/' },
    { name: 'Angular Homepage', url: 'https://angular.io/' },
    { name: 'Angular Documentation', url: 'https://angular.io/docs' },
    { name: 'Learn Angular', url: 'https://angular.io/tutorial' }
  ];

  /**
   *  Wie bei den Services wird auch in den Komponenten der Konstruktor über Angular aufgerufen.
   *  D.h. wir können hier verschiedene Services spezifizieren, auf die wir Zugriff haben möchten, welche
   *  automatisch durch "Dependency injection" hier instanziiert werden.
   */



}
