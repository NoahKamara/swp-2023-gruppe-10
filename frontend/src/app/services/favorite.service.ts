import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Favorite } from 'softwareproject-common/dist/favorite';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  constructor(private http: HttpClient) { }

  public makeFavorite(id: string): Observable<Favorite> {
      const observable = this.http.get<Favorite>('/api/events/'+id+'');

      observable.subscribe({
          error: (err) => {
              console.error(err);
          }
      });
      return observable;
  }
}
