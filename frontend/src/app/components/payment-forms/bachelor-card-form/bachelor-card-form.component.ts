import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AnyPaymentData } from '../../../services/tickets.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PaymentProviderPurchaseInterface } from '../PaymentProviderPurchaseInterface';
import { environment } from 'src/environments/environment';


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
export class BachelorCardFormComponent implements PaymentProviderPurchaseInterface, OnInit {
  @Output()
  didSubmit: EventEmitter<AnyPaymentData> = new EventEmitter();

  public formGroup = new FormGroup<BachelorcardDataFG>({
    name: new FormControl<string>('', [Validators.required]),
    number: new FormControl<string>('', [Validators.required]),
    code: new FormControl<string>('', [Validators.required]),
    date: new FormControl<string>('', [Validators.required, Validators.pattern('(?:0[1-9]|1[0-2])\/[0-9]{2}')]),
  });

  ngOnInit(): void {
    if (environment.isPresenting) {
      this.formGroup.setValue({
        name: 'Max Mustermann',
        number: '123456781234',
        code: '6123',
        date: '01/28'
      });
    }
  }

  submit(): void {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.invalid) return;

    const values = this.formGroup.value;

    this.didSubmit.emit({
      name: values.name ?? '',
      number: values.number ?? '',
      code: values.code ?? '',
      date: values.date ?? ''
    });
  }
}
