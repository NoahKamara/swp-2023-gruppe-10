import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'softwareproject-common';
import * as Leaflet from 'leaflet';
import { LocationService } from 'src/app/services/location.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  public event: Event | null = null;

  constructor(@Inject(LOCALE_ID) public locale: string, private route: ActivatedRoute, private router: Router, private eventService: EventService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      console.error('No ID Present');
      this.router.navigateByUrl('/events');
      return;
    }

    // fetch event
    const observeEvent = this.eventService.detail(id);

    // When event succeeds, set local var
    observeEvent.subscribe({
      next: (value) => {
        this.event = value;
      },
      error: console.error
    });
  }

  dateFormat(date: Date): string {
    return formatDate(date, 'dd.MM.yyyy', this.locale);
  }
}
