import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { Ticket } from 'softwareproject-common';
import { AnyPaymentData, SWPsafeData } from './tickets.service';
import { PaymentProvider } from 'softwareproject-common';

export type HCIPalData = {
  name: string
  password: string
}


@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(private http: HttpClient) { }

  payment({ provider, eventID, amount, data }: { provider: PaymentProvider; eventID: number; amount: number; data: AnyPaymentData; }): Observable<Ticket> {
    console.info(`purchasing ${amount} ticket(s) for event '${eventID}' using '${provider}'`);

    const observable = this.http.post<Ticket>(`/api/purchase?event=${eventID}&provider=${provider}&amount=${amount}`, data).pipe(shareReplay());

    observable.subscribe({
      next: (val) => {
        console.info('purchased', JSON.stringify(val));
      },
      error: (err) => {
        console.error('purchase error', err);
      },
    });

    return observable;
  }

  hcipal(data: { eventID: number; amount: number; data: HCIPalData; }): Observable<Ticket> {
    return this.payment({ provider: PaymentProvider.hciPal, ...data });
  }

  swpsafe(data: { eventID: number; amount: number; data: SWPsafeData; }): Observable<Ticket> {
    return this.payment({ provider: PaymentProvider.swpsafe, ...data });
  }
}
