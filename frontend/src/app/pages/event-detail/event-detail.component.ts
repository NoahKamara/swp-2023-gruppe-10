import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { Event, User } from 'softwareproject-common';
import { UserService } from 'src/app/services/user.service';
import * as Leaflet from 'leaflet';
import { LocationService } from 'src/app/services/location.service';
import { formatDate } from '@angular/common';
import { Favorite } from 'softwareproject-common/dist/favorite';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  public event: Event | undefined;
  public isFavorite = false;
  public return: void | undefined;
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
    const Favorite = this.eventService.isFavorite(id.toString());
    Favorite.subscribe({  
    next: (value) => {
        this.isFavorite = value;
      },
      error: console.error
    });

  }

  dateFormat(date: Date): string {
    return formatDate(date, 'dd.MM.yyyy', this.locale);
  }

  didClickFavButton(): void {
  const id  = this.route.snapshot.paramMap.get('id');
  if (!id) {
    console.error('No ID Present');
    return;
  }
  if(this.isFavorite === false){
    const data = this.eventService.makeFavorite(id);
    data.subscribe({
      next: (value) =>
        this.return = value,
    });
    this.isFavorite = true;
  }
  else{
    const data = this.eventService.makeFavorite(id);
    data.subscribe({
      next: (value) =>
        this.return = value,
    });
    this.isFavorite = false;
  }
    // const Favorite = this.eventService.isFavorite(id.toString());
    // Favorite.subscribe({  
    // next: (value) => {
    //     this.isFavorite = value;
    //     console.log(value);
    //   },
    //   error: console.error
    // });
    
  }
}

