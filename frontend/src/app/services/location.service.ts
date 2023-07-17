import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Location } from 'softwareproject-common';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(private http: HttpClient) { }
  /**
  * Lists all locations
  */
  public list(): Observable<Location[]> {
    return this.http.get<Location[]>('/api/locations/');
  }

  /**
  * Returns the location with the name
  * @param {string} name location name
  */
  public lookup(name: string): Observable<PublicLocation> {
    return this.http.get<PublicLocation>('/api/locations/'+name);
  }
}
export interface PublicLocation extends Location {
  average_rating: number
}
