import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentErrorMessage, Ticket } from 'softwareproject-common';
import { PaymentService } from 'src/app/services/payment.service';
import { environment } from 'src/environments/environment';
import { PaymentProviderPurchaseInterfaceNew } from '../PaymentProviderPurchaseInterface';


interface BachelorcardDataFG {
  name: FormControl<string | null>
  number: FormControl<string | null>
  code: FormControl<string | null>
  date: FormControl<string | null>
}

@Component({
  selector: 'app-bachelor-card-form',
  templateUrl: './bachelor-card-form.component.html',
  styleUrls: ['./bachelor-card-form.component.css']
})
export class BachelorCardFormComponent implements PaymentProviderPurchaseInterfaceNew, OnInit {
  @Input()
  eventID!: number;

  @Input()
  amount!: number;

  @Output()
  didPurchase: EventEmitter<Ticket> = new EventEmitter();

  constructor(private payment: PaymentService, private router: Router) { }

  public formGroup = new FormGroup<BachelorcardDataFG>({
    name: new FormControl<string>('', [Validators.required]),
    number: new FormControl<string>('', [Validators.required]),
    code: new FormControl<string>('', [Validators.required]),
    date: new FormControl<string>('', [Validators.required, Validators.pattern('(?:[1-9]|1[0-2])\/[0-9]{2}')]),
  });

  ngOnInit(): void {
    if (environment.isPresenting) {
      this.formGroup.setValue({
        name: 'Paul Milgramm',
        number: '4485-5420-1334-7098',
        code: '000',
        date: '4/44'
      });
    }
  }

  submit(): void {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.invalid) return;
    this.formGroup.disable();
    const values = this.formGroup.value;

    const data = {
      name: values.name ?? '',
      number: values.number ?? '',
      code: values.code ?? '',
      date: values.date ?? ''
    };

    this.payment.bachelorCard({ eventID: this.eventID, amount: this.amount, data: data }).subscribe({
      next: (val) => {
        console.log(val);
        this.didPurchase.emit(val);
      },
      error: (err: HttpErrorResponse) => {
        const error = err.error;
        console.error(error.error);

        this.formGroup.enable();

        switch (error.error) {
          case PaymentErrorMessage.internalError:
            console.error('Payment failed due to internal server error');
            break;
          case PaymentErrorMessage.foreignAccount:
            this.formGroup.controls.number.setErrors({
              'foreign': true
            });
            break;
          case PaymentErrorMessage.unknownAccount:
            this.formGroup.controls.number.setErrors({
              'unknown': true
            });
            break;
          case PaymentErrorMessage.invalidData:
            this.formGroup.controls.number.setErrors({
              'invalid': true
            });
            this.formGroup.controls.code.setErrors({
              'invalid': true
            });
            break;
          case PaymentErrorMessage.frozen:
            this.formGroup.controls.number.setErrors({
              'frozen': true
            });
            break;
          case PaymentErrorMessage.expired:
            this.formGroup.controls.date.setErrors({
              'expired': true
            });
            break;

          case PaymentErrorMessage.notEnoughBalance:
            this.formGroup.controls.number.setErrors({
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
