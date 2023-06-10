import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Location } from 'softwareproject-common';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(private http: HttpClient) { }

  public list(): Observable<Location[]> {
    return this.http.get<Location[]>('/api/locations/');
  }

  public lookup(name: string): Observable<Location> {
    return this.http.get<Location>('/api/locations/'+name);
  }
}
