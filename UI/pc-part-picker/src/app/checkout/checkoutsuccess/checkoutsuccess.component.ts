import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { StripeService } from 'ngx-stripe';
import { CartService } from '../../shared/services/cart/cart.service';
import { PaymentService } from '../../shared/services/payment/payment.service';
import { EmailService } from '../../shared/services/email/email.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkoutsuccess',
  imports: [ToastModule],
  templateUrl: './checkoutsuccess.component.html',
  styleUrl: './checkoutsuccess.component.css'
})
export class CheckoutsuccessComponent {

  constructor(private stripeService: StripeService, private checkoutService: PaymentService, private cartService: CartService, private http: HttpClient, private emailService: EmailService, private messageService: MessageService, private router: Router
  ) { }

  ngOnInit() {
    this.cartService.getCart().subscribe(cartItems => {
      this.emailService.sendEmail(cartItems).subscribe({
        next: () => {
          this.messageService.add({ severity: 'info', summary: 'Success!', detail: "Email sent successfully!", life: 2000 });
          this.cartService.clearCart().subscribe(() => {
            this.router.navigate(['/products-component']);
          });
        },
        error: err => this.messageService.add({ severity: 'error', summary: 'Success!', detail: "Failed to send email" + err.message, life: 2000 })
      });
    });
  }
}
