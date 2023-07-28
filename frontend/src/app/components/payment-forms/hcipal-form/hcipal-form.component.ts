import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentErrorMessage, Ticket } from 'softwareproject-common';
import { PaymentService } from 'src/app/services/payment.service';
import { HCIPalData } from 'src/app/services/tickets.service';
import { environment } from 'src/environments/environment';
import { PaymentProviderPurchaseInterfaceNew } from '../PaymentProviderPurchaseInterface';


interface DataFormGroup {
  email: FormControl<string | null>
  password: FormControl<string | null>
}

@Component({
  selector: 'app-hcipal-form',
  templateUrl: './hcipal-form.component.html',
  styleUrls: ['./hcipal-form.component.css']
})
export class HCIPalFormComponent implements PaymentProviderPurchaseInterfaceNew, OnInit {
  @Input()
  eventID!: number;

  @Input()
  amount!: number;

  @Output()
  didPurchase: EventEmitter<Ticket> = new EventEmitter();


  constructor(private payment: PaymentService, private router: Router) { }

  public formGroup = new FormGroup<DataFormGroup>({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required])
  });

  ngOnInit(): void {
    if (environment.isPresenting) {
      this.formGroup.setValue({
        email: 'petra@heisenberg.eu',
        password: '6uTQu8DhqXVz!!fXpGcD5'
      });
    }
  }

  submit(): void {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.invalid) return;

    this.formGroup.disable();
    const values = this.formGroup.value;

    const data: HCIPalData = {
      name: values.email ?? '',
      password: values.password ?? ''
    };


    this.payment.hcipal({ eventID: this.eventID, amount: this.amount, data: data }).subscribe({
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
            this.formGroup.controls.email.setErrors({
              'foreign': true
            });
            break;
          case PaymentErrorMessage.unknownAccount:
            this.formGroup.controls.email.setErrors({
              'unknown': true
            });
            break;
          case PaymentErrorMessage.invalidData:
            this.formGroup.controls.email.setErrors({
              'invalid': true
            });
            this.formGroup.controls.password.setErrors({
              'invalid': true
            });
            break;
          case PaymentErrorMessage.frozen:
            this.formGroup.controls.email.setErrors({
              'frozen': true
            });
            break;
          case PaymentErrorMessage.expired:
            this.formGroup.controls.email.setErrors({
              'expired': true
            });
            break;

          case PaymentErrorMessage.notEnoughBalance:
            this.formGroup.controls.email.setErrors({
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

