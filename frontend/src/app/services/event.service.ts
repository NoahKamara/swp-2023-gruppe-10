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

  public list(): Observable<EventListItem[]> {
    return this.http.get<EventListItem[]>('/api/events/');
  }

  public search(term: string): Observable<EventListItem[]> {
    return this.http.get<EventListItem[]>('/api/events?term='+term);
  }

  public detail(id: string | number): Observable<Event> {
    return this.http.get<Event>('/api/events/'+id);
  }
}
