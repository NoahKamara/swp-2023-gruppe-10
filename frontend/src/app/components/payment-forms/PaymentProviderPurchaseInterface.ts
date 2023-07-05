import { EventEmitter, Input } from '@angular/core';
import { Ticket } from 'softwareproject-common';
import { AnyPaymentData } from 'src/app/services/tickets.service';

export interface PaymentProviderPurchaseInterface {
  didSubmit: EventEmitter<AnyPaymentData>
}

export interface PaymentProviderPurchaseInterfaceNew {
  didPurchase: EventEmitter<Ticket>

  eventID: number;
  amount: number;
}

