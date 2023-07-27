import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventListItem } from 'softwareproject-common';
import { EventService } from 'src/app/services/event.service';
import { LocationService, PublicLocation } from 'src/app/services/location.service';


@Component({
  selector: 'app-location-detail',
  templateUrl: './location-detail.component.html',
  styleUrls: ['./location-detail.component.css']
})
export class LocationDetailComponent implements OnInit {

  public location: PublicLocation | null = null;
  public events: EventListItem[] = [];

  round(input: number): number {
    return Math.round(input * 100) / 100;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private locationService: LocationService,
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    const name = this.route.snapshot.paramMap.get('name');
    if (!name) {
      console.error('No name Present');
      this.router.navigateByUrl('/map');
      return;
    }

    // fetch Location
    this.locationService.lookup(name).subscribe({
      next: (value) => {
        this.location = value;
      },
      error: console.error
    });

    // Fetch Events for location
    this.eventService.filterUpcoming({ locations: [name] }).subscribe({
      next: (value) => {
        this.events = value;
      },
      error: console.error
    });
  }




  getIcon(star:number): string{
    if(star <= (this.location?.average_rating ?? 0)){
        return 'star';
    } else if(star <= (this.location?.average_rating ?? 0) +0.5){
      return 'star_half';
    } else{
      return 'grade';
    }
  }
}
