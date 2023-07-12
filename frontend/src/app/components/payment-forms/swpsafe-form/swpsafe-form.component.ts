import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AnyPaymentData, SWPsafeData } from 'src/app/services/tickets.service';
import { PaymentProviderPurchaseInterface, PaymentProviderPurchaseInterfaceNew } from '../PaymentProviderPurchaseInterface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { PaymentService } from 'src/app/services/payment.service';
import { PaymentErrorMessage, Ticket } from 'softwareproject-common';

interface DataFormGroup {
  code: FormControl<string | null>
}

@Component({
  selector: 'app-swpsafe-form',
  templateUrl: './swpsafe-form.component.html',
  styleUrls: ['./swpsafe-form.component.css']
})
export class SWPsafeFormComponent implements PaymentProviderPurchaseInterfaceNew, OnInit {
  @Input()
  eventID!: number;

  @Input()
  amount!: number;

  @Output()
  didPurchase: EventEmitter<Ticket> = new EventEmitter();

  public formGroup = new FormGroup<DataFormGroup>({
    code: new FormControl<string>('', [Validators.required])
  });

  constructor(private payment: PaymentService) {}

  ngOnInit(): void {
    if (environment.isPresenting) {
      this.formGroup.setValue({
        code: 'y^t@y7#uMYu@',
      });
    }
  }


  submit(): void {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.invalid) return;
    this.formGroup.disable();

    const values = this.formGroup.value;
    const data: SWPsafeData = {
      code: values.code ?? ''
    };

    this.payment.swpsafe({ eventID: this.eventID, amount: this.amount, data: data }).subscribe({
      next: (val) => {
        console.log(val);
        this.didPurchase.emit(val);
      },
      error: (err) => {
        const error = err.error;
        console.error(error.context);

        this.formGroup.enable();

        switch (error.error) {
          case PaymentErrorMessage.internalError:
            console.error('Payment failed due to internal server error');
            break;
          case PaymentErrorMessage.foreignAccount:
            this.formGroup.setErrors({
              'foreign': true
            });
            break;
          case PaymentErrorMessage.unknownAccount:
            this.formGroup.setErrors({
              'unknown': true
            });
            break;
          case PaymentErrorMessage.invalidData:
            this.formGroup.setErrors({
              'invalid': true
            });
            break;
          case PaymentErrorMessage.frozen:
            this.formGroup.setErrors({
              'frozen': true
            });
            break;
          case PaymentErrorMessage.expired:
            this.formGroup.setErrors({
              'expired': true
            });
            break;

          case PaymentErrorMessage.notEnoughBalance:
            this.formGroup.setErrors({
              'balance': true
            });
            break;
          default:
            console.log('unknown error', error.error);
        }
      }
    });
  }
}

