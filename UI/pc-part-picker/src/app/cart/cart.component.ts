import { PaymentService } from './../shared/services/payment/payment.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CartItem } from '../../model/CartItem';
import { CartService } from '../shared/services/cart/cart.service';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { StripeService } from '../shared/services/stripe/stripe.service';
import { ProductServiceService } from '../shared/services/products/product-service.service';
import { PcPart } from '../../model/Pcpart';
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterOutlet],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  enrichedCart: EnrichedCartItem[] = [];
  totalPrice: number | null | undefined;

  constructor(private cartService: CartService, private router: Router, private paymentService: PaymentService, private productService: ProductServiceService,
  ) { }

  ngOnInit(): void {
    this.loadCart();
  }

  addToCart(partType: string, partId: number, quantity: number = 1): void {
    const item: CartItem = {
      partType,
      partId,
      quantity
    };

    this.cartService.addToCart(item).subscribe(() => {
      this.loadCart(); // Refresh cart after adding
    });
  }

  loadCart(): void {
    // reset
    this.totalPrice = 0;

    this.cartService.getCart().subscribe(cartItems => {
      this.cartItems = cartItems;

      if (!cartItems.length) {
        this.enrichedCart = [];
        this.totalPrice = 0;
        return;
      }

      const lookups = cartItems.map(item =>
        this.productService.getPart<PcPart>(item.partId, item.partType).pipe(
          map(part => ({
            ...item,
            name: part?.name ?? 'Unknown',
            // coerce to integer, discard decimals if any
            price: this.toIntPrice((part as any)?.price)
          }))
        )
      );

      forkJoin(lookups).subscribe(enriched => {
        this.enrichedCart = enriched;
        this.totalPrice = this.enrichedCart.reduce(
          (sum, it) => sum + this.toIntPrice(it.price) * (it.quantity ?? 1),
          0
        );
      });
    });
  }

  private toIntPrice(v: any): number {
    if (typeof v === 'number') return Math.trunc(v);
    if (typeof v === 'string') {
      const n = Number(v.replace(/[, ]/g, ''));
      return Number.isFinite(n) ? Math.trunc(n) : 0;
    }
    return 0;
  }
  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item).subscribe(() => this.loadCart());
    window.location.reload()
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe(() => this.loadCart());
    window.location.reload()
  }

  updateCart(item: CartItem, delta: number) {
    this.cartService.updateCart(item, delta).subscribe(() => this.loadCart());
  }

  navigateToCheckout() {
    this.router.navigateByUrl("/checkout-component")
  }

  buyThisProduct() {
    this.paymentService.createCheckoutSession(this.cartItems);
  }

  checkout() { this.router.navigate(['/checkout/shipping']); }

  fetchString(part: PcPart) {
    return part.name;
  }
  getImagePath(product: any): string {
    return this.productService.getImagePath(product);
  }
}
interface EnrichedCartItem extends CartItem {
  name: string;
  price?: number | null;
  // any other part data you want to show
}