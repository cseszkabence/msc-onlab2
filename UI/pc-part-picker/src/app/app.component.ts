import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Motherboard } from '../model/Motherboard';
import { filterProductsByName, ProductServiceService } from './product-service.service';
import { Observable } from 'rxjs';
import { Processor } from '../model/Processor';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    trigger('slideDownUp', [
      state('void', style({ height: '0px', opacity: 0 })),
      state('*', style({ height: '*', opacity: 1 })),
      transition('void <=> *', animate('300ms ease-in-out')),
    ]),
  ],
})
export class AppComponent {

  title = 'PC PART PICKER';
  categoryNumber: number = 0;

  constructor(
    private productService: ProductServiceService
  ) { }

  showSearchBar: boolean = false;
  showProductsBar: boolean = false;

  cards = [
    { title: 'Processor', content: ' ' },
    { title: 'Motherboard', content: ' ' },
    { title: 'Memory', content: ' ' },
    { title: 'Videocard', content: ' ' },
    { title: 'Storage', content: ' ' },
    { title: 'Powersupply', content: ' ' },
    { title: 'Case', content: ' ' },
    { title: 'Processor cooler', content: ' ' },
  ];

  searchQuery: string = '';

  toggleSearch(): void {
    this.showProductsBar = false;
    this.showSearchBar = !this.showSearchBar;
  }

  toggleProducts(): void {
    this.showSearchBar = false;
    this.showProductsBar = !this.showProductsBar;
  }

  ngOnInit() { }

  async searchProducts() {
    await this.productService.searchProducts(this.searchQuery);
  }

  async cleanSearch() {
    this.searchQuery = '';
    this.searchProducts();
  }

  async chooseProduct(n: number) {
    this.categoryNumber = n;
    await this.productService.chooseProduct(n);
  }

}
