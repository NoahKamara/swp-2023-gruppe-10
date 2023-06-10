import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { EventListItem } from 'softwareproject-common';
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

  constructor(private eventService: EventService) { }

  public searchTerm: string | null = null;

  dateFormat(date: string | Date): string {
    console.log(typeof date);
    return (new Date(date)).toLocaleDateString();
  }

  onSearchTermChange(): void {
    if (!this.searchTerm) {
      this.fetchAll();
      return;
    }

    this.eventService.search(this.searchTerm).subscribe({
      next: (value) => {
        this.events = value;
      },
      error: console.error
    });
  }

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
}
