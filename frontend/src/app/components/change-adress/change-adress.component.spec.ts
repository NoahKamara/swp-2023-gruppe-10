import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeAdressComponent } from './change-adress.component';

describe('ChangeAdressComponent', () => {
  let component: ChangeAdressComponent;
  let fixture: ComponentFixture<ChangeAdressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeAdressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeAdressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
