import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventListItem } from 'softwareproject-common';
import { Event } from 'softwareproject-common';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private http: HttpClient) { }

  /**
  * Lists all _upcoming_ locations
  */
  public list(): Observable<EventListItem[]> {
    return this.http.get<EventListItem[]>('/api/events/');
  }

  /**
  * Lists all _upcoming_ locations that match the search term
  * @param {string} term search term
  */
  public search(term: string): Observable<EventListItem[]> {
    return this.http.get<EventListItem[]>('/api/events?term='+term);
  }

  /**
  * Returns the location with the id
  * @param {string | number} id event id (may be int or string because path params are strings)
  */
  public detail(id: string | number): Observable<Event> {
    return this.http.get<Event>('/api/events/'+id);
  }
}
