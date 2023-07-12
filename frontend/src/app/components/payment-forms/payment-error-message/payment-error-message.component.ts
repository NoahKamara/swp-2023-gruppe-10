import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-payment-error-message',
  templateUrl: './payment-error-message.component.html',
  styleUrls: ['./payment-error-message.component.css']
})
export class PaymentErrorMessageComponent {
  @Input()
  control!: FormControl<unknown>;
}
