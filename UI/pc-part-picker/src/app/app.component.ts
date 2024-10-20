import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Motherboard } from '../model/Motherboard';
import { ProductServiceService } from './product-service.service';
import { Observable } from 'rxjs';


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
  private APIUrl = "http://localhost:5147/api"

  constructor(
    private httpClient:HttpClient,
    private productService: ProductServiceService
  ){}

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

  electronicsFilters = [
    { name: 'Manufacturer', options: [{ name: 'Brand A', checked: false }, { name: 'Brand B', checked: false }] },
    { name: 'Price', options: [{ name: 'Under $500', checked: false }, { name: '$500 - $1000', checked: false }] }
  ];
  // Example filters and products for clothing
  clothingFilters = [
    { name: 'Size', options: [{ name: 'Small', checked: false }, { name: 'Medium', checked: false }, { name: 'Large', checked: false }] },
    { name: 'Color', options: [{ name: 'Red', checked: false }, { name: 'Blue', checked: false }] }
  ];

  currentProducts!: Observable<any[]>;
  searchQuery: string = '';

  toggleSearch(): void {
    this.showProductsBar = false;
    this.showSearchBar = !this.showSearchBar;
  }

  toggleProducts(): void {
    this.showSearchBar = false;
    this.showProductsBar = !this.showProductsBar;
  }
  
  ngOnInit() 
  {}

  async chooseProduct(n: number) {
    this.productService.chooseProduct(n);
  }
}
