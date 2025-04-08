import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../../../../model/CartItem';

@Injectable({
  providedIn: 'root'
})
@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = 'http://localhost:5147/api/cart';

  constructor(private http: HttpClient) { }

  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();


  getCart(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.apiUrl + '?userId=1');
  }

  getCartObservable(): Observable<CartItem[]> {
    return this.cart$;
  }

  addToCart(item: CartItem) {
    return this.http.post(this.apiUrl, item);
  }

  removeFromCart(item: CartItem): Observable<void> {
    return this.http.delete<void>(this.apiUrl, { body: item });
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clear`);
  }

  updateCart(item: CartItem, quantityDelta: number): Observable<void> {
    const payload: CartItem = {
      ...item,
      quantity: quantityDelta
    };

    return this.http.post<void>(this.apiUrl + '/update', payload);
  }
}

//cart = signal<any[]>([]);

/* addToCart(product: any){
  this.cart.set([...this.cart(), product]);
} */
