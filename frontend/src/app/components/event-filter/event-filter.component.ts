import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, debounceTime } from 'rxjs';
import { EventFilter } from 'softwareproject-common';

@Component({
  selector: 'app-event-filter',
  templateUrl: './event-filter.component.html',
  styleUrls: ['./event-filter.component.css'],
  animations: [
    trigger('expandAnimation', [
      state('collapsed', style({ height: '0', opacity: 0 })),
      state('expanded', style({ height: '*', opacity: 1 })),
      transition('collapsed <=> expanded', [animate('300ms ease-out')]),
    ]),
  ],
})
export class EventFilterComponent implements OnInit {
  @Input()
  isCollapsed = true;

  @Output()
  filterChange = new EventEmitter<EventFilter>();
  public debouncer = new Subject<EventFilter>();

  dateRange = new FormGroup({
    startDate: new FormControl<Date>(new Date()),
    endDate: new FormControl<Date|null>(null),
  });

  public minPrice = 0;

  ngOnInit(): void {
    this.debouncer
      .pipe(debounceTime(100))
      .subscribe((val) => this.filterChange.emit(val));

    this.dateRange.valueChanges.subscribe(() => { this.didChange(); });
  }

  public maxPrice = 104.98;

  public locations: string[] = [];

  public today: Date = new Date();

  clearDate(): void {
    this.dateRange.controls.endDate.setValue(null);
    this.dateRange.controls.startDate.setValue(this.today);
    this.didChange();
  }

  clearPrice(): void {
    this.minPrice = 0;
    this.maxPrice = 104.98;
    this.didChange();
  }

  clearLocations(): void {
    this.locations = [];
    this.didChange();
  }


  didChange(): void {
    const filter: EventFilter = {
      startDate: this.dateRange.controls.startDate.value ?? undefined,
      endDate: this.dateRange.controls.endDate.value ?? undefined,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      locations: this.locations.length > 0 ? this.locations : undefined
    };

    this.debouncer.next(filter);
  }
}
