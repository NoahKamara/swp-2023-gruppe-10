import { Component, OnInit } from '@angular/core';

/**
 * Typescript erlaub es uns, auch einen ganzen Namespace zu importieren statt einzelne Komponenten.
 * Die "Komponenten" (Klassen, Methoden, ...) des Namespace können dann via "Leaflet.Komponente"
 * aufgerufen werden, z.B. "Leaflet.LeafletMouseEvent" (siehe unten)
 */
import * as Leaflet from 'leaflet';

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
  layers = [
    Leaflet.marker([47.70642034921702, 9.195273407778386])
  ];


  /**
   * Diese Methode wird im "map.component.html" Code bei Leaflet registriert
   * und aufgerufen, sobald der Benutzer auf die Karte klickt
   */
  onMapClick(e: Leaflet.LeafletMouseEvent): void {
    console.log(`${e.latlng.lat}, ${e.latlng.lng}`);
  }


  ngOnInit(): void {
    
    for (const layer of this.layers) {
      // Eventhandler (z.B. wenn der Benutzer auf den Marker klickt) können
      // auch direkt in Typescript hinzugefügt werden
      layer.on('click', (e: Leaflet.LeafletMouseEvent) => {

        // Mittels der (im Browser eingebauten) alert() Methode wird ein
        // Browser Pop-up Fenster geöffnet
        alert('Marker was clicked!');

        // In der Konsole können die Events genauer angeschaut werden,
        // was die Entwicklung erleichtern kann
        console.log(e);
      });
    }
  }

}
