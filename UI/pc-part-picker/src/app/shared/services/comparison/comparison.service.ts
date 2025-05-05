import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PcPart } from '../../../../model/Pcpart';

@Injectable({
  providedIn: 'root'
})
export class ComparisonService {
  private products: PcPart[] = [];
  private category: string | null = null;

  private comparisonListSubject = new BehaviorSubject<PcPart[]>([]);
  comparisonList$ = this.comparisonListSubject.asObservable();

  constructor() { }

  addProduct(product: PcPart): { success: boolean; message?: string } {
    if (this.products.length === 0) {
      this.category = product.type_name;
    }

    if (product.type_name !== this.category) {
      return {
        success: false,
        message: `Only products from category '${this.category}' can be compared!`,
      };
    }

    const exists = this.products.some(p => p.id === product.id);
    if (exists) {
      return {
        success: false,
        message: `This product is already added to the list!`,
      };
    }
    else {
      this.products.push(product);
      this.comparisonListSubject.next(this.products);
    }

    return { success: true };
  }

  removeProduct(productId: number): void {
    this.products = this.products.filter(p => p.id !== productId);
    if (this.products.length === 0) {
      this.category = null;
    }
    this.comparisonListSubject.next(this.products);
  }

  clearComparison(): void {
    this.products = [];
    this.category = null;
    this.comparisonListSubject.next(this.products);
  }

  getComparisonList(): PcPart[] {
    return [...this.products];
  }

  getCategory(): string | null {
    return this.category;
  }

  getCount(): number {
    return this.products.length;
  }
}