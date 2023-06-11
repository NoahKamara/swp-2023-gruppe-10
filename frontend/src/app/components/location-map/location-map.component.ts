import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MapOptions, LatLng, TileLayer, Marker, marker } from 'leaflet';
import { Location } from 'softwareproject-common';
import { LocationService } from 'src/app/services/location.service';

/**
 * A small non-interactable map that shows a location
 */
@Component({
  selector: 'app-location-map',
  templateUrl: './location-map.component.html',
  styleUrls: ['./location-map.component.css']
})
export class LocationMapComponent implements OnInit {

  /**
   * The name of a location like 'Palmenhaus'
  */
  @Input()
  public locationName!: string;

  @Input()
  public enableNavigation = true;

  private location: Location | null = null;

  constructor(private locationService: LocationService, private router: Router) { }

  options: MapOptions = {
    layers: [new TileLayer('http://konstrates.uni-konstanz.de:8080/tile/{z}/{x}/{y}.png'),],
    zoom: 15,
    center: new LatLng(47.705, 9.194589),
    attributionControl: false,
    zoomControl: false,
    dragging: false,
    minZoom: 15,
    maxZoom: 15
  };

  layers: Marker[] = [];

  didClick(): void {
    if (!this.enableNavigation) return;
    this.router.navigateByUrl('/map/'+this.locationName);
  }
  ngOnInit(): void {
    this.locationService.lookup(this.locationName).subscribe({
      next: (location) => {
        this.layers = [marker([location.coordinates_lat, location.coordinates_lng])];
        this.location = location;
      },
      error: (err) => {
        console.error('error looking up event-location', err);
      }
    });
  }
}
