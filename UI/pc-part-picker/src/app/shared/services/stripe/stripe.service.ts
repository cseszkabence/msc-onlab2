import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { Observable, switchMap } from 'rxjs';
import { CheckoutItem } from '../../../../model/CheckoutItem';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
}