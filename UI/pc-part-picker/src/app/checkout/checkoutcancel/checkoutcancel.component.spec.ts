import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutcancelComponent } from './checkoutcancel.component';

describe('CheckoutcancelComponent', () => {
  let component: CheckoutcancelComponent;
  let fixture: ComponentFixture<CheckoutcancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutcancelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutcancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
