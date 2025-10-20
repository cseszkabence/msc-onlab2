import { trigger, state, style, transition, animate } from '@angular/animations';
import { NgStyle, NgIf, NgFor } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { InputGroup } from 'primeng/inputgroup';
import { ToastModule } from 'primeng/toast';
import { Toolbar } from 'primeng/toolbar';
import { AuthService } from '../shared/services/auth/auth.service';
import { CartService } from '../shared/services/cart/cart.service';
import { ProductServiceService } from '../shared/services/products/product-service.service';
import { finalize, map, Observable } from 'rxjs';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { ComparisonService } from '../shared/services/comparison/comparison.service';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { BuildService } from '../shared/services/builder/builder.service';
import { TooltipModule } from 'primeng/tooltip';
import { ToggleButtonModule } from 'primeng/togglebutton';

type CategoryKey =
  | 'processor' | 'motherboard' | 'memory' | 'videocard'
  | 'storage' | 'powersupply' | 'case' | 'cpucooler';

interface Category { key: CategoryKey; label: string; route: string; }


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
  imports: [Toolbar, RouterModule, ContextMenuModule, Button, NgStyle, NgIf, InputGroup, FormsModule, NgFor, RouterOutlet, ToggleButtonModule, ToastModule, BadgeModule, OverlayBadgeModule, TooltipModule],
  standalone: true
})
export class MenuComponent implements OnInit {
  menuItems = [
    {
      label: 'Clear Comparison',
      icon: 'pi pi-trash',
      command: () => this.clearComparison()
    }
  ];

  @ViewChild('cm') contextMenu!: ContextMenu;
  title = 'PC PART PICKER';
  categoryNumber: number = 0;
  isLoggedIn = false;

  constructor(
    private productService: ProductServiceService,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService,
    private comparisonService: ComparisonService,
    private buildSvc: BuildService
  ) { }

  cartService = inject(CartService)
  showSearchBar: boolean = false;
  showProductsBar: boolean = false;
  comparisonCount = 0;
  cartSize = 0;
  buildFilledCount = 0;
isLoggingOut = false;

  categories: Category[] = [
    { key: 'processor', label: 'Processors', route: 'processor' },
    { key: 'motherboard', label: 'Motherboards', route: 'motherboard' },
    { key: 'memory', label: 'Memories', route: 'memory' },
    { key: 'videocard', label: 'Videocards', route: 'videocard' },
    { key: 'storage', label: 'Storage', route: 'storage' },
    { key: 'powersupply', label: 'Powersupplies', route: 'powersupply' },
    { key: 'case', label: 'Cases', route: 'case' },
    { key: 'cpucooler', label: 'CPU Coolers', route: 'cpucooler' },
  ];

  activeCategory: CategoryKey | null = null;

  onToggleCategory(cat: Category, checked: boolean) {
    if (!checked) { return; } // ignore uncheck
    this.activeCategory = cat.key;
    // single-select behavior
    this.activeCategory = checked ? cat.key : null;

    if (checked) {
      // If your app navigates to /products/:type
      this.router.navigate(['/products', cat.route]).then();

      // If you *also* need to trigger an API load without navigation, keep this:
      // this.productService.chooseProduct(cat.label);
    }
  }

  searchQuery: string = '';

  toggleSearch(): void {
    this.showSearchBar = !this.showSearchBar;
  }

  toggleProducts(): void {
    this.showProductsBar = !this.showProductsBar;
    //this.router.navigateByUrl("/products-component");
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
    this.comparisonService.comparisonList$.subscribe(list => {
      this.comparisonCount = list.length;
    });
    this.cartService.totalQuantity$.subscribe(qty => {
      this.cartSize = qty;
    });
    this.buildSvc.countFilled$.subscribe(n => {
      this.buildFilledCount = n;
    });
    this.cartService.loadCart(); // trigger initial load
    this.chooseProduct('Processor');
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

  async chooseProduct(n: string) {
    //this.categoryNumber = n;
    await this.productService.chooseProduct(n);
  }

  onLogout() {
  this.isLoggingOut = true;

  this.authService.logout()
    .pipe(finalize(() => this.isLoggingOut = false))
    .subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Logout successful!', life: 3000 });
        // Only reload AFTER the request completed
        window.location.reload();
      },
      error: err => {
        // If the cookie expired, [Authorize] may reject with 401; still treat as logged out
        if (err.status === 401 || err.status === 403 || err.status === 0) {
          this.messageService.add({ severity: 'info', summary: 'You were already logged out.', life: 2500 });
          window.location.reload();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Logout failed', detail: 'Please try again.' });
        }
      }
    });
}

  navigateToCart() {
    this.router.navigateByUrl("/cart-component").then(() => this.disableBars())
  }

  getCartSize(): Observable<number> {
    return this.cartService.getCart().pipe(
      map(cart => cart.reduce((total, item) => total + item.quantity, 0))
    );
  }

  goToComparison(): void {
    this.router.navigateByUrl("/comparison-component").then(() => this.disableBars())
  }

  onRightClick(event: MouseEvent): void {
    this.contextMenu.show(event);
  }

  clearComparison(): void {
    this.comparisonService.clearComparison();
  }
}
