import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AnyPaymentData } from 'src/app/services/tickets.service';
import { PaymentProviderPurchaseInterface } from '../PaymentProviderPurchaseInterface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';


interface DataFormGroup {
  email: FormControl<string | null>
  password: FormControl<string | null>
}

@Component({
  selector: 'app-hcipal-form',
  templateUrl: './hcipal-form.component.html',
  styleUrls: ['./hcipal-form.component.css']
})
export class HCIPalFormComponent implements PaymentProviderPurchaseInterface, OnInit {

  @Output()
  didSubmit: EventEmitter<AnyPaymentData> = new EventEmitter();

  public formGroup = new FormGroup<DataFormGroup>({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required])
  });

  ngOnInit(): void {
    if (environment.isPresenting) {
      this.formGroup.setValue({
        email: 'max.mustermann@email.com',
        password: 'max.mustermann@email.com'
      });
    }
  }

  submit(): void {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.invalid) return;

    const values = this.formGroup.value;

    this.didSubmit.emit({
      email: values.email ?? '',
      password: values.password ?? ''
    });
  }
}

