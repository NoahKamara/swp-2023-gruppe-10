import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LocationService } from 'src/app/services/location.service';
import { Location } from 'softwareproject-common';


@Component({
  selector: 'app-location-filter',
  templateUrl: './location-filter.component.html',
  styleUrls: ['./location-filter.component.css']
})
export class LocationFilterComponent implements OnInit {
  @Input()
  selection: string[] = [];

  public locations: Location[] = [];

  @Output()
  selectionChange = new EventEmitter<string[]>();

  constructor(private locationService: LocationService) {}
  ngOnInit(): void {
    this.locationService.list().subscribe({
      next: (value) => {
        this.locations = value;
      },
    });
  }
}
