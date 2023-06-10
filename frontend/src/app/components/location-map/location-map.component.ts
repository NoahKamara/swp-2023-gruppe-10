import { Component, Input, OnInit } from '@angular/core';
import { MapOptions, LatLng, TileLayer, Marker, marker } from 'leaflet';
import { Location } from 'softwareproject-common';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-location-map',
  templateUrl: './location-map.component.html',
  styleUrls: ['./location-map.component.css']
})
export class LocationMapComponent implements OnInit {
  @Input()
  public locationName!: string;

  private location: Location | null = null;

  constructor(private locationService: LocationService) {}

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
