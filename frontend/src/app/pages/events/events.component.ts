import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
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
      { optional: true}
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
  public isFavorite = false ;

  constructor(private eventService: EventService) { }

  public searchTerm: string | null = null;

  public filter: EventFilter = {
    startDate: new Date()
  };
  // dateFormat(date: string | Date): string {
  //   console.log(typeof date);
  //   return (new Date(date)).toLocaleDateString();
  // }

  filterDidChange(): void {
    console.log(JSON.stringify(this.filter));
  }

  // Perform search
  onSearchTermChange(): void {
    // If serach term is empty, fetch all events
    if (!this.searchTerm) {
      this.fetchAll();
      return;
    }

    const filter: EventFilter = {
      term: this.searchTerm.length > 0 ? this.searchTerm : undefined,
    };

    this.eventService.filterUpcoming(filter).subscribe({
      next: (value) => {
        this.events = [];
        this.events = value;
      },
      error: console.error
    });
  }

  // fetch all events
  fetchAll(): void {
    this.eventService.list().subscribe({
      next: (value) => {
        this.events = value;
      },
      error: console.error
    });
  }

  ngOnInit(): void {
    this.fetchAll();
  }
  didClickFavButton(): void {
    if(this.isFavorite === false){
      this.isFavorite = true;
    }
    else{
      this.isFavorite = false;
    }
  }
}
