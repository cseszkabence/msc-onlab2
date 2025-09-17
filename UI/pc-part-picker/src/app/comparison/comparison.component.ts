import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PcPart } from '../../model/Pcpart';
import { ComparisonService } from '../shared/services/comparison/comparison.service';
import { TableModule } from 'primeng/table';
import { CartService } from '../shared/services/cart/cart.service';
import { CartItem } from '../../model/CartItem';
import { MenuItem } from 'primeng/api';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { ButtonModule } from 'primeng/button';

const comparisonRules: Record<string, Record<string, 'asc' | 'desc'>> = {
  Processor: {
    clockSpeed: 'desc',
    cores: 'desc',
    tdp: 'asc',
    price: 'asc'
  },
  Memory: {
    speed: 'desc',
    latency: 'asc',
    capacity: 'desc',
    price: 'asc'
  }
};

@Component({
  selector: 'app-comparison-page',
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.scss'],
  imports: [CommonModule, TableModule, ContextMenuModule, ButtonModule]
})
export class ComparisonComponent implements OnInit {
  products: PcPart[] = [];
  comparisonKeys: string[] = [];
  bestValues: Record<string, any> = {};
  selectedProduct!: PcPart | null;
  items!: MenuItem[];

  @ViewChild('cm') cm!: ContextMenu;

  constructor(private comparisonService: ComparisonService, private cartService: CartService) { }

  ngOnInit(): void {
    this.products = this.comparisonService.getComparisonList();
    this.generateComparisonKeys();
    this.calculateBestValues();
    this.items = [
      { label: 'Add to cart', icon: 'pi pi-fw pi-trash', command: () => this.addToCart(this.selectedProduct!) },
      {
        label: 'Delete', icon: 'pi pi-fw pi-cart-plus', command: () => {
          this.comparisonService.removeProduct(this.selectedProduct!.id);
          this.products = this.comparisonService.getComparisonList();
        }
      }
    ];
  }

  generateComparisonKeys(): void {
    if (this.products.length > 0) {
      const keys = Object.keys(this.products[0]);
      this.comparisonKeys = keys.filter(key =>
        !['id', 'type_name'].includes(key)
      );
    }
  }

  calculateBestValues(): void {
    const category = this.products[0]?.type_name;
    const rules = comparisonRules[category] || {};

    this.comparisonKeys.forEach(key => {
      const values = this.products.map(p => p[key]);
      const isNumeric = values.every(v => typeof v === 'number');

      if (!isNumeric) {
        this.bestValues[key] = null;
        return;
      }

      if (rules[key] === 'asc') {
        this.bestValues[key] = Math.min(...values);
      } else if (rules[key] === 'desc') {
        this.bestValues[key] = Math.max(...values);
      } else {
        this.bestValues[key] = null; // No rule defined
      }
    });
  }

  addToCart(part: PcPart, number = 1): void {
    const item: CartItem = {
      partType: part.type_name,
      partId: part.id,
      quantity: number,
    };

    this.cartService.addToCart(item).subscribe();
  }

  isBestValue(key: string, value: any): boolean {
    return value === this.bestValues[key];
  }

  onCellRightClick(event: MouseEvent, product: any): void {
    this.selectedProduct = product;
    this.cm.show(event); // cm is a ViewChild reference to the ContextMenu
  }

  clearComparison(): void {
    this.comparisonService.clearComparison();
    window.location.reload();
  }
}
