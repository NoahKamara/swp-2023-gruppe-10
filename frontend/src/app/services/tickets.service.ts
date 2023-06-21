import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export type BachelorcardData = {
  name: string
  number: string
  code: string
  date: string
}

export type SWPsafeData = {
  code: string
}

export type HCIPalData = {
  email: string
  password: string
}

export type AnyPaymentData = SWPsafeData | HCIPalData | BachelorcardData;

export type Ticket = string;

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  constructor(private http: HttpClient) { }

  public purchaseTicket({ eventID, paymentsData }: { eventID: number; paymentsData: AnyPaymentData; }): Observable<Ticket> {
    return this.http.post<Ticket>('/api/purchase/'+eventID, paymentsData);
  }
}
