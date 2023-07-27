import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EventFilter, EventListItem } from 'softwareproject-common';
import { EventService } from 'src/app/services/event.service';

const listAnimation = trigger('listAnimation', [
  transition('* <=> *', [
    query(':enter',
      [style({ opacity: 0 }), stagger('60ms', animate('700ms ease-in', style({ opacity: 1 })))],
      { optional: true }
    ),
    query(':leave',
      animate('200ms', style({ opacity: 0 })),
      { optional: true }
    )
  ])
]);



@Component({
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
  animations: [listAnimation]
})
export class EventsComponent implements OnInit {

  events: EventListItem[] = [];
  public showFilters = false;

  public isFavorite = false;

  constructor(private eventService: EventService) { }

  public searchTerm: string | null = null;

  public filter: EventFilter = {
    startDate: new Date()
  };

  filterDidChange(filter: EventFilter): void {
    if (this.filter === filter) {
      console.debug('filter did not actually change. no reload');
      return;
    }
    this.filter = filter;
    this.updateList();
    // console.log(JSON.stringify(this.filter, undefined, 2));
  }

  public dateRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  // Perform search
  updateList(): void {
    const filter: EventFilter = {
      ...this.filter,
      term: this.searchTerm ?? undefined
    };

    this.eventService.filterUpcoming(filter).subscribe({
      next: (value) => {
        if (this.events !== value) {
          this.events = value;
        }
      },
      error: console.error
    });
  }

  ngOnInit(): void {
    this.updateList();
  }

  didClickFavButton(): void {
    this.filter.onlyFavorites = !this.filter.onlyFavorites ?? true;
    this.updateList();
  }
}
