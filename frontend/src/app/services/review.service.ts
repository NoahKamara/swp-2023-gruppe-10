import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { CreateReview, PublicReview } from 'softwareproject-common';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http: HttpClient) { }

  // myReview(locationName: string): Observable<PublicReview> {}

  all(locationName: string): Observable<PublicReview[]> {
    const observable = this.http.get<PublicReview[]>('/api/locations/'+encodeURI(locationName)+'/reviews');

    observable.subscribe({
      error: (err) => {
        console.error(err);
      }
    });

    return observable;
  }

  mine(locationName: string): Observable<PublicReview> {
    const observable = this.http.get<PublicReview>('/api/locations/'+encodeURI(locationName)+'/reviews/me');

    observable.subscribe({
      error: (err) => {
        console.error(err);
      }
    });

    return observable;
  }

  post(locationName: string, review: CreateReview): Observable<PublicReview> {
    const observable = this.http.post<PublicReview>('/api/locations/'+encodeURI(locationName)+'/reviews', review).pipe(shareReplay());

    observable.subscribe({
      error: (err) => {
        console.error(err);
      }
    });

    return observable;
  }


  toggleHelpful(reviewID: number): Observable<number> {
    const observable = this.http.patch<ReviewHelpfulCountUpdate>('/api/helpful/'+reviewID, null);

    return observable.pipe(map(r => r.count));
  }
}


interface ReviewHelpfulCountUpdate {
  count: number;
}
