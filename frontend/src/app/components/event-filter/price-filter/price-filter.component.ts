import { Component, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { LabelType, Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-price-filter',
  templateUrl: './price-filter.component.html',
  styleUrls: ['./price-filter.component.css']
})
export class PriceFilterComponent {
  @Input()
  minValue!: number;

  @Input()
  maxValue!: number;

  @Output()
  minValueChange = new EventEmitter<number>();

  @Output()
  maxValueChange = new EventEmitter<number>();

  public options: Options = {
    floor: 0,
    ceil: 105,
    translate: (value: number, label: LabelType): string => {
      return String(value)+' €';
    }
  };

}
