import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventListItem, Location } from 'softwareproject-common';
import { EventService } from 'src/app/services/event.service';
import { LocationService } from 'src/app/services/location.service';
import { ReviewComponent } from '../review/review.component';

@Component({
  selector: 'app-location-detail',
  templateUrl: './location-detail.component.html',
  styleUrls: ['./location-detail.component.css']
})

export class LocationDetailComponent implements OnInit {
  
  public location: Location | null = null;
  public events: EventListItem[] = [];

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

  public rating = 3.5;

  
  getIcon(star:number): string{

    if(star <= this.rating){
        return 'star';
    } else if(star <= this.rating +0.5){
      return 'star_half';
    } else{
      return 'grade';
    }
  }

  openReviews(): void{
    this.router.navigateByUrl('/reviews');
  }

}
