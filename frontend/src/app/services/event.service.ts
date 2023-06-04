import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventListItem } from 'softwareproject-common';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private http: HttpClient) { }

  public list(): Observable<EventListItem[]> {
    return this.http.get<EventListItem[]>('/api/events/');
  }

  //   public details(id: number): Observable<Event> {
  //     return this.http.get<NameInfo>('/api/name/');
  // }
}
