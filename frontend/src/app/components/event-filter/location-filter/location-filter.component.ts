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

  didChange(): void {
    console.log('change');
    this.selectionChange.emit(this.selection);
  }
  ngOnInit(): void {
    this.locationService.list().subscribe({
      next: (value) => {
        this.locations = value.sort((lhs,rhs) => { return rhs.name < lhs.name ? 1 : -1; });
      },
    });
  }
}
