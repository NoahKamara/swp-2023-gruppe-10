import { EventEmitter } from '@angular/core';
import { AnyPaymentData } from 'src/app/services/tickets.service';

export interface PaymentProviderPurchaseInterface {
  didSubmit: EventEmitter<AnyPaymentData>
}
