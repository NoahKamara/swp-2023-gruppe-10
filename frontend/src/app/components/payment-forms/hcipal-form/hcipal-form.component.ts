import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AnyPaymentData, HCIPalData, TicketsService } from 'src/app/services/tickets.service';
import { PaymentProviderPurchaseInterfaceNew } from '../PaymentProviderPurchaseInterface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { PaymentService } from 'src/app/services/payment.service';
import { Router } from '@angular/router';
import { Ticket } from 'softwareproject-common';

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

  @Output()
  didPurchase: EventEmitter<Ticket> = new EventEmitter();

  @Input()
  eventID!: number;

  @Input()
  amount!: number;

  public interactionEnabled = true;

  constructor(private payment: PaymentService, private router: Router) {}

  public formGroup = new FormGroup<DataFormGroup>({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required])
  });

  ngOnInit(): void {
    if (environment.isPresenting) {
      this.formGroup.setValue({
        email: 'paul@milgram.de',
        password: 'zJac6Em^q7JrG@w!FMf4@'
      });
    }
  }

  submit(): void {
    this.formGroup.markAllAsTouched();


    if (this.formGroup.invalid) return;

    this.setInteraction(false);
    const values = this.formGroup.value;

    const data: HCIPalData = {
      name: values.email ?? '',
      password: values.password ?? ''
    };

    this.payment.hcipal({ eventID: this.eventID, amount: 1, data: data }).subscribe({
      next: (val) => {
        console.log(val);
        this.didPurchase.emit(val);
      },
      error: (err) => {
        console.log(err);
        this.setInteraction(true);
      }
    });
  }

  setInteraction(value: boolean): void {
    this.interactionEnabled = value;
    if (value) {
      this.formGroup.enable();
    } else {
      this.formGroup.disable();
    }
  }
}

