import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CartItem } from '../../../../model/CartItem';
import { loadStripe } from '@stripe/stripe-js';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private apiUrl = 'http://localhost:5147/api/';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  constructor(private http: HttpClient) { }

  async createCheckoutSession(cartItems: CartItem[]) {
    const stripe = await loadStripe('pk_test_51Q2EtTB2B1CUn6npnZe7bRixfPQnqYFUZnSqpu7C3uN7yOuXivIm5g17sx2DSXBNoW54AgGGI8Gr375xJwsTaBz100kdXsqT4p');
    this.http.post(this.apiUrl+'create-checkout-session', { products: cartItems })
      .subscribe((response: any) => {
        stripe?.redirectToCheckout({ sessionId: response.sessionId });
      });
  }
}
