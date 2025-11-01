import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { StripeService } from 'ngx-stripe'; // if you actually use it elsewhere
import { MessageService } from 'primeng/api';
import { CartService } from '../../shared/services/cart/cart.service';
import { EmailService } from '../../shared/services/email/email.service';
import { OrderService } from '../../shared/services/order/order.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-checkoutsuccess',
  templateUrl: './checkoutsuccess.component.html',
  styleUrls: ['./checkoutsuccess.component.css'],
  imports:[CommonModule, ButtonModule]
})
export class CheckoutsuccessComponent implements OnInit {
  loading = true;
  error: string | null = null;
  orderId!: number;

  get hasOrderId() { return typeof this.orderId === 'number' && !isNaN(this.orderId); }


  constructor(
    private stripeService: StripeService,
    private cartService: CartService,
    private http: HttpClient,
    private emailService: EmailService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
        private orders: OrderService,

  ) {}

  ngOnInit() {
    const qp = this.route.snapshot.queryParamMap;
    const sessionId = qp.get('session_id') ?? undefined;

    // Prefer query param; fallback to sessionStorage (we saved it before redirecting to Stripe)
    const fromQs = qp.get('orderId');
    const fallback = sessionStorage.getItem('orderId');
    const parsed = Number(fromQs ?? fallback ?? NaN);

    if (!parsed || isNaN(parsed)) {
      this.loading = false;
      this.error = 'We could not determine your order ID.';
      this.messageService.add({ severity: 'error', summary: 'Error', detail: this.error, life: 4000 });
      return;
    }

    this.orderId = parsed;

   this.orders.confirm(this.orderId, sessionId).subscribe({
      next: () => {
        this.emailService.sendReceipt(this.orderId).subscribe({
          next: () => {
            this.loading = false;
            this.cartService.loadCart();
            this.messageService.add({
              severity: 'success',
              summary: 'Order confirmed',
              detail: `Receipt sent for Order #${this.orderId}`,
              life: 3000
            });
            sessionStorage.removeItem('orderId');
          },
          error: (err) => {
            this.loading = false;
            this.messageService.add({
              severity: 'warn',
              summary: 'Order confirmed',
              detail: `Receipt failed: ${err?.message || err}`,
              life: 5000
            });
          }
        });
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error || 'Could not confirm order.';
      }
    });
  }

  // Helpers for your template actions (optional)
  goToOrders() { this.router.navigate(['/account/orders']); }
  continueShopping() { this.router.navigate(['/products']); }
}
