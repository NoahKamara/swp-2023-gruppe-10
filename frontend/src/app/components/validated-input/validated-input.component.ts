import { Component, ContentChildren, ElementRef, EventEmitter, Input, Output, QueryList } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-validated-input',
  templateUrl: './validated-input.component.html',
  styleUrls: ['./validated-input.component.css']
})
export class ValidatedInputComponent {
  @Input()
  public label!: string;

  @Input()
  public control!: FormControl;

  @ContentChildren('content')
  content!: QueryList<ElementRef>;

  @Output()
  textChange = new EventEmitter<FormControl>();

  @Input()
  public type?: string | null;

  // if field is invalid, this property is true
  get hasError(): boolean {
    return this.control.invalid && this.control.touched;
  }

  onTextChange(): void {
    this.textChange.emit(this.control);
  }
}
