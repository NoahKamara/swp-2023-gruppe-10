import { Component, OnInit } from '@angular/core';

/**
 * Typescript erlaub es uns, auch einen ganzen Namespace zu importieren statt einzelne Komponenten.
 * Die "Komponenten" (Klassen, Methoden, ...) des Namespace können dann via "Leaflet.Komponente"
 * aufgerufen werden, z.B. "Leaflet.LeafletMouseEvent" (siehe unten)
 */
import * as Leaflet from 'leaflet';
import { Location } from 'softwareproject-common';
import { LocationService } from 'src/app/services/location.service';

@Component({
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  /**
   * Bitte Dokumentation durchlesen: https://github.com/bluehalo/ngx-leaflet
   */
  options: Leaflet.MapOptions = {
    layers: [new Leaflet.TileLayer('http://konstrates.uni-konstanz.de:8080/tile/{z}/{x}/{y}.png'),],
    zoom: 16,
    center: new Leaflet.LatLng(47.70475111537479, 9.195249855100897),
    attributionControl: false
  };

  /**
   * Um z.B. einen Marker auf der Map einzuzeichnen, übergeben wir Leaflet
   * ein Array von Markern mit Koordinaten. Dieses Attribut wird im HTML Code
   * dann an Leaflet weitergegeben.
   * Dokumentation: https://github.com/bluehalo/ngx-leaflet#add-custom-layers-base-layers-markers-shapes-etc
   */
  layers: Leaflet.Marker[] = [];

  didLoad = false;

  constructor(private locationService: LocationService) { }

  /**
   * Diese Methode wird im "map.component.html" Code bei Leaflet registriert
   * und aufgerufen, sobald der Benutzer auf die Karte klickt
   */
  onMapClick(e: Leaflet.LeafletMouseEvent): void {
    console.log(`${e.latlng.lat}, ${e.latlng.lng}`);
  }


  ngOnInit(): void {

    // Load locations and set markers
    this.locationService.list().subscribe({
      next: (locs) => {
        this.layers = this.makeMarkers(locs);
        this.didLoad = true;
      },
      error: (err) => console.error('map failed to load locations', err)
    });
  }

  makeMarkers(locations: Location[]): Leaflet.Marker[] {
    return locations.map(loc => {
      console.log(loc.coordinates_lat, loc.coordinates_lng);

      const marker = Leaflet.marker(
        [loc.coordinates_lat, loc.coordinates_lng],
        {title: loc.name}
      );

      marker.on('click', () => {
        this.didClickLocation(loc);
      });

      return marker;
    });
  }

  didClickLocation(location: Location): void {
    alert(`Location ${location.name} was clicked!`);
    console.log('clicked', location);
  }
}
