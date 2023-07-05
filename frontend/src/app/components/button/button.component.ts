import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';


@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {

  @Input()
  class = '';

  @Input()
  disabled: boolean = false;

  @Input()
  level = 0;

  @Input()
  routerLink: string | null = null;

  @Output()
  didClick: EventEmitter<void> = new EventEmitter();
}
