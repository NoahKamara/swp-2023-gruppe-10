import { Component, OnInit } from '@angular/core';
import { EventListItem } from 'softwareproject-common';
import { EventService } from 'src/app/services/event.service';

@Component({
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  events: EventListItem[] = [];

  constructor(private eventService: EventService) { }

  dateFormat(date: string | Date): string {
    console.log(typeof date);
    return (new Date(date)).toLocaleDateString();
  }
  ngOnInit(): void {

    this.eventService.list().subscribe({
      next: (value) => {
        this.events = value;
      },
      error: console.error
    });
  }
}
