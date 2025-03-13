import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Motherboard } from '../model/Motherboard';
import { filterProductsByName, ProductServiceService } from './product-service.service';
import { Observable } from 'rxjs';
import { Processor } from '../model/Processor';
import { Router, RouterOutlet } from '@angular/router';
import { Toolbar } from 'primeng/toolbar';
import { Button } from 'primeng/button';
import { NgStyle, NgIf, NgFor } from '@angular/common';
import { InputGroup } from 'primeng/inputgroup';
import { FormsModule } from '@angular/forms';


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
        trigger('slideUpDown', [
            state('void', style({ height: '0px', opacity: 0, transform: 'translateY(-100%)' })),
            state('*', style({ height: '*', opacity: 1, transform: 'translateY(0)' })),
            transition('void <=> *', animate('300ms ease-in-out')),
        ])
    ],
    imports: [Toolbar, Button, NgStyle, NgIf, InputGroup, FormsModule, NgFor, RouterOutlet]
})
export class AppComponent implements OnInit{


  title = 'PC PART PICKER';
  categoryNumber: number = 0;

  constructor(
    private productService: ProductServiceService,
    private router: Router
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
    this.showSearchBar = !this.showSearchBar;
  }

  toggleProducts(): void {
    this.showProductsBar = !this.showProductsBar;
    this.router.navigateByUrl("/products-component");
  }

  navigateToConfigurator() {
    this.router.navigateByUrl("/configurator-component").then(() => this.disableBars())
  }

  ngOnInit() { }

  disableBars() {
    this.showSearchBar = false;
    this.showProductsBar = false;
  }

  ngOnDestroy(): void {
    this.toggleProducts();
  }

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
