// email.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmailService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:5147/api/email';

  // New method: send the receipt for a specific order
  sendReceipt(orderId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/receipt/${orderId}`, {}, { withCredentials: true });
  }
}
