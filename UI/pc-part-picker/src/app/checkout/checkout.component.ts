import { StripeService, StripeCardComponent } from 'ngx-stripe';
import { loadStripe, StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { Component, ViewChild } from '@angular/core';
import { PaymentService } from '../shared/services/payment/payment.service';
import { CartService } from '../shared/services/cart/cart.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-checkout',
  imports: [StripeCardComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  @ViewChild(StripeCardComponent)
  card!: StripeCardComponent;

  cardOptions: StripeCardElementOptions = { style: { base: { fontSize: '16px' } } };
  elementsOptions: StripeElementsOptions = { locale: 'en' };

  constructor(private stripeService: StripeService, private checkoutService: PaymentService, private cartService: CartService, private http: HttpClient) { }

  async pay() {
    const cart = this.cartService.getCart(); // Replace with your actual cart retrieval logic

    this.http.post<{ clientSecret: string }>('/api/create-payment-intent', cart)
      .subscribe(async result => {
        const clientSecret = result.clientSecret;

        var response = await this.stripeService.confirmCardPayment(clientSecret, {
          payment_method: {
            card: this.card.element,
          }
        }).toPromise();

        if (response?.error) {
          console.error('Payment error:', response?.error.message);
          alert(response?.error.message);
        } else if (response?.paymentIntent?.status) {
          alert('Payment successful!');
        }
      });
  }
}
