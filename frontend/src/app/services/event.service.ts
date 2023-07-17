import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, debounceTime, shareReplay } from 'rxjs';
import { Event, EventFilter, EventListItem } from 'softwareproject-common';
import { Favorite } from 'softwareproject-common/dist/favorite';



@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  /**
  * Lists all _upcoming_ locations
  */
  // public list(): Observable<EventListItem[]> {
  //   return this.http.get<EventListItem[]>('/api/events/').pipe(shareReplay()).pipe(debounceTime(500));
  // }

  /**
  * Lists all _upcoming_ locations
  */
  public filterUpcoming(filter: Partial<EventFilter>): Observable<EventListItem[]> {
    console.log('searching with filter', filter);
    return this.http.post<EventListItem[]>('/api/events/', filter).pipe(debounceTime(500));
  }

  /**
  * Lists all _upcoming_ locations that match the search term
  * @param {string} term search term
  */
  // public search(term: string): Observable<EventListItem[]> {
  //   return this.http.get<EventListItem[]>('/api/events?term=' + term);
  // }

  /**
  * Returns the location with the id
  * @param {string | number} id event id (may be int or string because path params are strings)
  */
  public detail(id: string | number): Observable<Event> {
    return this.http.get<Event>('/api/events/' + id);
  }

  public makeFavorite(id: string): Observable<void>{
   return this.http.get<void>('/api/events/'+id+'/addOrDelete');

  }
  public isFavorite(id:string): Observable<boolean>{
    return this.http.get<boolean>('/api/events/'+id+'/isFavorite');

  }


}
