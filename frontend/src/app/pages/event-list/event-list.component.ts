import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { EventListItem } from 'softwareproject-common';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
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
