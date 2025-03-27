import { trigger, state, style, transition, animate } from '@angular/animations';
import { NgStyle, NgIf, NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { InputGroup } from 'primeng/inputgroup';
import { ToastModule } from 'primeng/toast';
import { Toolbar } from 'primeng/toolbar';
import { AuthService } from '../shared/services/auth/auth.service';
import { CartService } from '../shared/services/cart/cart.service';
import { ProductServiceService } from '../shared/services/products/product-service.service';

@Component({
  selector: 'menu-component',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
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
  providers: [MessageService],
  imports: [Toolbar, Button, NgStyle, NgIf, InputGroup, FormsModule, NgFor, RouterOutlet, ToastModule],
  standalone:true
})
export class MenuComponent  implements OnInit{

  title = 'PC PART PICKER';
  categoryNumber: number = 0;
  isLoggedIn=false;

  constructor(
    private productService: ProductServiceService,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService,
  ) { }

  cartService = inject(CartService)
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

  navigateToAccount() {
    this.router.navigateByUrl("/user-component").then(() => this.disableBars())
  }

  ngOnInit() { 
    this.authService.loginStatus$.subscribe(status => {
      this.isLoggedIn = status;
    });
  }

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

  onLogout(){
    this.authService.onLogout();
    this.messageService.add({ severity: 'success', summary: 'Logout successful!', detail: '', life: 3000 });
  }

  navigateToCart() {
    this.router.navigateByUrl("/cart-component").then(() => this.disableBars())
  }
}
