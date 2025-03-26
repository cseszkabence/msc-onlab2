import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../../model/CartItem';
import { CartService } from '../../shared/services/cart/cart.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(private cartService: CartService) { }

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
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item).subscribe(() => this.loadCart());
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe(() => this.loadCart());
  }

  updateCart(item: CartItem, delta: number){
    this.cartService.updateCart(item, delta).subscribe(() => this.loadCart());
  }
}
