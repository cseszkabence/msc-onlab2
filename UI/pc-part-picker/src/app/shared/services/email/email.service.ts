import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartItem } from '../../../../model/CartItem';
import { ProductServiceService } from '../products/product-service.service';
import { map, forkJoin, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private apiUrl = 'http://localhost:5147/api/email';

  constructor(private http: HttpClient, private productService: ProductServiceService) {}

  sendEmail(cartItems: CartItem[]) {
    const partRequests = cartItems.map(item =>
      this.productService.getPart(item.partId, item.partType).pipe(
        map(part => `${part.name} x${item.quantity}\n`)
      )
    );

    return forkJoin(partRequests).pipe(
      map(lines => {
        const email: EmailModel = {
          from: 'cseszkabence@edu.bme.hu',
          toEmail: 'cseszkabence@gmail.com',
          subject: 'Your Order Summary',
          body: lines.join('\n'),
          isHtml: false
        };
        return email;
      }),
      switchMap(email => this.http.post<void>(this.apiUrl + '/sendmail', email))
    );
  }
}

export interface EmailModel{
  from: string;
  toEmail: string;
  subject: string;
  body: string;
  isHtml: boolean;
}