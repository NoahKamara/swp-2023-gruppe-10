import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ticket } from 'softwareproject-common';

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
  name: string
  password: string
}

export type AnyPaymentData = SWPsafeData | HCIPalData | BachelorcardData;

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  constructor(private http: HttpClient) { }

  public purchaseTicket({ eventID, paymentsData }: { eventID: number; paymentsData: AnyPaymentData; }): Observable<Ticket> {
    return this.http.post<Ticket>('/api/tickets/'+eventID, paymentsData);
  }

  public listTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>('/api/tickets');
  }

  public details(id: number): Observable<Ticket> {
    return this.http.get<Ticket>('/api/tickets/'+id);
  }
}
