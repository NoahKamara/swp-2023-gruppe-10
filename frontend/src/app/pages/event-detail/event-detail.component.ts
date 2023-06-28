import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'softwareproject-common';
import * as Leaflet from 'leaflet';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  public event: Event | null = null;
  public isFavorite = false ;

  constructor(private route: ActivatedRoute, private router: Router, private eventService: EventService) { }

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
  didClickFavButton(): void {
  if(this.isFavorite === false){
    this.isFavorite = true;
  }
  else{
    this.isFavorite = false;
  }
}
}
