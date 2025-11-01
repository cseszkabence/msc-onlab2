import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE = '/api/orders';

export interface ShippingAddressDto {
  recipientName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;   // ISO-2, e.g. 'HU'
  phone?: string;
  currency: string;  // e.g. 'eur'
}

export interface DraftOrderResponse { orderId: number; }
export interface CheckoutSessionResponse { url: string; sessionId: string; }
export interface ConfirmOrderResponse { orderId: number; status: string; totalPrice: number; }

export interface OrderSummary {
  orderId: number;
  orderDate: string; // ISO
  status: string;
  totalPrice: number;
}
export interface OrderItemDto {
  orderItemId: number;
  partTypeId: number;
  partId: number;
  quantity: number;
  unitPrice: number;
}
export interface OrderDetail extends OrderSummary {
  items: OrderItemDto[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:5147/api/orders';

  /** Step 1: create a draft order from the cart + shipping address */
  createDraft(dto: ShippingAddressDto): Observable<DraftOrderResponse> {
    return this.http.post<DraftOrderResponse>(`${this.apiUrl}/draft`, dto, { withCredentials: true });
  }

  /** Step 2: create a Stripe Checkout session for a specific order */
  createCheckoutSession(orderId: number): Observable<CheckoutSessionResponse> {
    return this.http.post<CheckoutSessionResponse>(
      `${this.apiUrl}/${orderId}/checkout-session`,
      {},
      { withCredentials: true }
    );
  }

  /** Step 3: confirm the order after Stripe success (idempotent) */
  confirm(orderId: number, sessionId?: string): Observable<ConfirmOrderResponse> {
    return this.http.post<ConfirmOrderResponse>(
      `${this.apiUrl}/${orderId}/confirm`,
      { sessionId },
      { withCredentials: true }
    );
  }

  /** Optional: list & view orders for the current user */
  list(): Observable<OrderSummary[]> {
    return this.http.get<OrderSummary[]>(`${this.apiUrl}`, { withCredentials: true });
  }

  get(orderId: number): Observable<OrderDetail> {
    return this.http.get<OrderDetail>(`${this.apiUrl}/${orderId}`, { withCredentials: true });
  }
}
