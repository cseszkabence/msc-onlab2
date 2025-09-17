import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, tap } from 'rxjs';
import { CartItem } from '../../../../model/CartItem';

@Injectable({
  providedIn: 'root'
})
@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = 'http://localhost:5147/api/cart';

  constructor(private http: HttpClient) { }
  private items: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  private totalQuantitySubject = new BehaviorSubject<number>(0);
  totalQuantity$ = this.totalQuantitySubject.asObservable();
  
  loadCart(): void {
    this.getCart().subscribe(items => {
      this.items = items;
      this.cartSubject.next(items);
      const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
      this.totalQuantitySubject.next(totalQty);
    });
  }
  

  getCart(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.apiUrl, {withCredentials: true});
  }

  getCartObservable(): Observable<CartItem[]> {
    return this.cart$;
  }

  addToCart(item: CartItem) {
    return this.http.post(this.apiUrl, item, {withCredentials: true}).pipe(tap(() => this.loadCart()));
  }

  removeFromCart(item: CartItem): Observable<void> {
    return this.http.delete<void>(this.apiUrl, { body: item }, ).pipe(tap(() => this.loadCart()));
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clear`, {withCredentials: true}).pipe(tap(() => this.loadCart()));
  }

  updateCart(item: CartItem, quantityDelta: number): Observable<void> {
    const payload: CartItem = {
      ...item,
      quantity: quantityDelta
    };

    return this.http.post<void>(this.apiUrl + '/update', payload , {withCredentials: true}).pipe(tap(() => this.loadCart()));
  }
  getTotalQuantity(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  addManyToCart(items: CartItem[]): Observable<any[]> {
    return forkJoin(items.map(i => this.addToCart(i)));
  }
}