import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmanuelMoellComponent } from './emanuel-moell.component';

describe('EmanuelMoellComponent', () => {
  let component: EmanuelMoellComponent;
  let fixture: ComponentFixture<EmanuelMoellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmanuelMoellComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmanuelMoellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
