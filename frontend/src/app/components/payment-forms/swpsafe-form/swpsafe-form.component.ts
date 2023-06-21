import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AnyPaymentData } from 'src/app/services/tickets.service';
import { PaymentProviderPurchaseInterface } from '../PaymentProviderPurchaseInterface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';


interface DataFormGroup {
  code: FormControl<string | null>
}

@Component({
  selector: 'app-swpsafe-form',
  templateUrl: './swpsafe-form.component.html',
  styleUrls: ['./swpsafe-form.component.css']
})
export class SWPsafeFormComponent implements PaymentProviderPurchaseInterface, OnInit {
  @Output()
  didSubmit: EventEmitter<AnyPaymentData> = new EventEmitter();

  public formGroup = new FormGroup<DataFormGroup>({
    code: new FormControl<string>('', [Validators.required])
  });

  ngOnInit(): void {
    if (environment.isPresenting) {
      this.formGroup.setValue({
        code: '1234567812345678',
      });
    }
  }


  submit(): void {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.invalid) return;

    const values = this.formGroup.value;

    this.didSubmit.emit({
      code: values.code ?? ''
    });
  }
}

