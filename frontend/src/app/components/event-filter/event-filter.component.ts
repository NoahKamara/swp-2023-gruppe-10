import { Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCalendarCellClassFunction, MatCalendar } from '@angular/material/datepicker';
import { LabelType, Options } from '@angular-slider/ngx-slider';
import { EventFilter } from 'softwareproject-common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-event-filter',
  templateUrl: './event-filter.component.html',
  styleUrls: ['./event-filter.component.css']
})
export class EventFilterComponent implements OnInit {

  @Output()
  filterChange = new EventEmitter<EventFilter>();

  dateRange = new FormGroup({
    startDate: new FormControl<Date>(new Date()),
    endDate: new FormControl<Date|null>(null),
  });

  public minPrice = 0;

  ngOnInit(): void {
    this.dateRange.valueChanges.subscribe(() => { this.didChange(); });
  }

  public maxPrice = 104.98;

  public locations: string[] = [];

  public today: Date = new Date();

  clearDate(): void {
    this.dateRange.controls.endDate.setValue(null);
    this.dateRange.controls.startDate.setValue(this.today);
  }

  clearPrice(): void {
    this.minPrice = 0;
    this.maxPrice = 104.98;
  }

  clearLocation(): void {
    this.locations = [];
  }

  didChange(): void {
    const filter: EventFilter = {
      startDate: this.dateRange.controls.startDate.value ?? undefined,
      endDate: this.dateRange.controls.endDate.value ?? undefined,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      locations: this.locations.length > 0 ? this.locations : undefined
    };

    this.filterChange.emit(filter);
  }
}
