import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
export enum PaymentProvider {
  bachelorcard = 'bachelorcard',
  hciPal = 'hciPal',
  swpsafe = 'swpsafe'
}

@Component({
  selector: 'app-payment-provider-btn',
  templateUrl: './payment-provider-btn.component.html',
  styleUrls: ['./payment-provider-btn.component.css']
})
export class PaymentProviderBtnComponent {
  @Input()
  public provider!: PaymentProvider;

  @Output()
  didSelect: EventEmitter<PaymentProvider> = new EventEmitter();

  didTapBtn(): void {
    this.didSelect.emit(this.provider);
  }
}
