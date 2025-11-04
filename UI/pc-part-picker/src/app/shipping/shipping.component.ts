import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { OrderService, ShippingAddressDto } from '../shared/services/order/order.service';
import { switchMap, tap } from 'rxjs';
import { FloatLabel, FloatLabelModule } from "primeng/floatlabel";

@Component({
  selector: 'app-shipping',
  imports: [CommonModule,
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    DividerModule, FloatLabelModule],
  templateUrl: './shipping.component.html',
  styleUrl: './shipping.component.css'
})
export class ShippingComponent {
  form = this.fb.group({
    recipientName: ['', [Validators.required, Validators.maxLength(160)]],
    line1: ['', [Validators.required, Validators.maxLength(160)]],
    line2: [''],
    city: ['', [Validators.required, Validators.maxLength(100)]],
    state: ['', [Validators.required, Validators.maxLength(100)]],
    postalCode: ['', [Validators.required, Validators.maxLength(20)]],
    country: ['HU', [Validators.required, Validators.maxLength(2)]],
    phone: ['',[Validators.required]],
    currency: ['eur', [Validators.required]] // choose based on your market
  });

  constructor(private fb: FormBuilder, private http: HttpClient, private orders: OrderService) { }
showLine2 = false; // collapses/expands Address line 2

  countries = [
    { name: 'Hungary', code: 'HU' },
    { name: 'Austria', code: 'AT' },
    { name: 'Germany', code: 'DE' },
    { name: 'Slovakia', code: 'SK' },
    { name: 'Czechia', code: 'CZ' },
    { name: 'Romania', code: 'RO' },
    { name: 'United States', code: 'US' },
    { name: 'United Kingdom', code: 'GB' },
    { name: 'France', code: 'FR' },
    { name: 'Spain', code: 'ES' },
    { name: 'Italy', code: 'IT' },
  ];

  currencies = [
    { label: 'EUR €', value: 'eur' },
    { label: 'USD $', value: 'usd' },
  ];


  submit() {
    if (this.form.invalid) return;
    const dto = this.form.value as ShippingAddressDto;

    this.orders.createDraft(dto).pipe(
      tap(res => sessionStorage.setItem('orderId', String(res.orderId))),
      switchMap(res => this.orders.createCheckoutSession(res.orderId))
    ).subscribe({
      next: ({ url }) => window.location.href = url,
      error: (err) => {
        // handle/display error as you do elsewhere
        console.error('Draft/Checkout failed', err);
      }
    });
  }
} 
