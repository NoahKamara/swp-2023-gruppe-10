import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent {
  @Input()
  public title!: string;

  onSubmit(): void  {
    this.didSubmit.emit();
  }

  @Output()
  didSubmit: EventEmitter<void> = new EventEmitter();
}
