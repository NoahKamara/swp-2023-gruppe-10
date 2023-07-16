import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDateFilterComponent } from './event-date-filter.component';

describe('EventDateFilterComponent', () => {
  let component: EventDateFilterComponent;
  let fixture: ComponentFixture<EventDateFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventDateFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventDateFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
