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

  constructor(private cartService: CartService,private router: Router,private paymentService: PaymentService, private productService: ProductServiceService,
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
    this.cartService.getCart().subscribe(items => this.cartItems = items);
    this.cartService.getCart().subscribe(cartItems => {
      const observables = cartItems.map(item =>
        this.productService.getPart<PcPart>(item.partId, item.partType).pipe(
          map(part => ({
            ...item,
            name: part.name ?? 'Unknown',
            price: part.price
          }))
        )
      );
  
      forkJoin(observables).subscribe(enrichedItems => {
        this.enrichedCart = enrichedItems;
      });
    });
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item).subscribe(() => this.loadCart());
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe(() => this.loadCart());
    window.location.reload()
  }

  updateCart(item: CartItem, delta: number){
    this.cartService.updateCart(item, delta).subscribe(() => this.loadCart());
  }

  navigateToCheckout() {
    this.router.navigateByUrl("/checkout-component")
  }

  buyThisProduct(){
    this.paymentService.createCheckoutSession(this.cartItems);
  }

  fetchString(part: PcPart){
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