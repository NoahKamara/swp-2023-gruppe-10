import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from 'softwareproject-common';
import { LocationService } from 'src/app/services/location.service';
import { ReviewComponent } from '../review/review.component';

@Component({
  selector: 'app-location-detail',
  templateUrl: './location-detail.component.html',
  styleUrls: ['./location-detail.component.css']
})

export class LocationDetailComponent implements OnInit {
  
  public location: Location | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private locationService: LocationService) { }

  ngOnInit(): void {
    const name = this.route.snapshot.paramMap.get('name');
    if (!name) {
      console.error('No name Present');
      this.router.navigateByUrl('/map');
      return;
    }

    // fetch event
    const observeEvent = this.locationService.lookup(name);

    // When event succeeds, set local var
    observeEvent.subscribe({
      next: (value) => {
        this.location = value;
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
