import { Component, inject, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { MatSliderModule } from '@angular/material/slider';
import { map, Observable, Subscription } from 'rxjs';
import { Filter, filterProductsByName, ProductServiceService } from '../shared/services/products/product-service.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Processor } from '../../model/Processor';
import { PcPart } from '../../model/Pcpart';
import { Harddrive } from '../../model/Harddrive';
import { Cpucooler } from '../../model/Cpucooler';
import { Pccase } from '../../model/Pccase';
import { Powersupply } from '../../model/Powersupply';
import { Videocard } from '../../model/Videocard';
import { Memory } from '../../model/Memory';
import { Motherboard } from '../../model/Motherboard';
import { Splitter } from 'primeng/splitter';
import { Accordion, AccordionPanel, AccordionHeader, AccordionContent } from 'primeng/accordion';
import { NgFor, NgIf, AsyncPipe, CurrencyPipe } from '@angular/common';
import { Ripple } from 'primeng/ripple';
import { Checkbox } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { Card } from 'primeng/card';
import { PrimeTemplate } from 'primeng/api';
import { Button } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { DataView } from 'primeng/dataview';
import { Rating } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { SelectButton } from 'primeng/selectbutton';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';
import { ScrollTopModule } from 'primeng/scrolltop';
import { CartService } from '../shared/services/cart/cart.service';
import { CartItem } from '../../model/CartItem';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
  standalone: true,
  imports: [DataView, ScrollTopModule, Rating, ButtonModule, SelectButton, Tag, CommonModule, Splitter, Accordion, NgFor, AccordionPanel, Ripple, AccordionHeader, AccordionContent, Checkbox, FormsModule, NgIf, Card, PrimeTemplate, Button, AsyncPipe, CurrencyPipe]
})
export class ProductsComponent implements OnInit {

  private subscriptions: Subscription[] = [];  // Track all subscriptions
  cartService = inject(CartService)

  filters: Filter[] = [];
  layout!: "list" | "grid";

  options = ["list", "grid"];
  warn: "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined;
  getSeverity() {
    return this.warn;
  }

  products$!: Observable<PcPart[]>;
  allProducts!: PcPart[];

  enabledFilters = 0;

  constructor(private productService: ProductServiceService, public dialog: MatDialog, private router: Router,
  ) { }

  ngOnInit(): void {
    this.layout = 'list';
    this.fetchData();
    this.saveOriginalProductsList();
    this.subscriptions.push(
      this.products$.subscribe({
        next: (products) => this.productService.productsSubject.next(products)
      })
    );

    this.subscriptions.push(
      this.productService.filters$.subscribe((filters) => {
        this.filters = filters;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());  // Unsubscribe from all
  }

  saveOriginalProductsList(): void {
    //this.allProducts$ = this.productService.originalProducts;
  }

  getImagePath(product: any): string {
    const basePath = '/assets/images/';
    if (product.videocardid > 0) {
      return `${basePath}${product.chipset!}.jpg`;
    }
    else {
      return `${basePath}${product.name!}.jpg`;
    }
  }

  private getFolderName(product: PcPart): string {
    if (this.isProcessor(product)) return 'processors';
    if (this.isMotherboard(product)) return 'motherboards';
    if (this.isMemory(product)) return 'memory';
    if (this.isVideocard(product)) return 'videocards';
    if (this.isHarddrive(product)) return 'harddrives';
    if (this.isPowersupply(product)) return 'powersupplies';
    if (this.isPccase(product)) return 'cases';
    if (this.isCpucooler(product)) return 'processor_coolers';
    return 'unknown'; // Fallback
  }

  fetchData() {
    this.products$ = this.productService.products$;
  }

  onChange(event: any, index: any, item: any) {
    this.enabledFilters = 0;
    this.productService.resetProducts();
    this.filters.forEach(async filter => {
      if (filter.name == "Manufacturer") {
        filter.options.forEach(option => {
          if (option.checked) {
            this.enabledFilters++;
            this.productService.filterManufacturers(option);
          }
        })
      }
      else if (filter.name == "Series") {
        filter.options.forEach(option => {
          if (option.checked) {
            this.enabledFilters++;
            this.productService.filterSeries(option);
          }
        })
      }
      else if (filter.name == "Sockets") {
        filter.options.forEach(option => {
          if (option.checked) {
            this.enabledFilters++;
            this.productService.filterSocketType(option);
          }
        })
      }
      else if (filter.name == "Form Factors") {
        filter.options.forEach(option => {
          if (option.checked) {
            this.enabledFilters++;
            this.productService.filterFormFactorType(option);
          }
        })
      }
      else if (filter.name == "Memory Types") {
        filter.options.forEach(option => {
          if (option.checked) {
            this.enabledFilters++;
            this.productService.filterMemoryType(option);
          }
        })
      }
      else if (filter.name == "Chipsets") {
        filter.options.forEach(option => {
          if (option.checked) {
            this.enabledFilters++;
            this.productService.filterChipsetType(option);
          }
        })
      }
      else if (filter.name == "Drive Types") {
        filter.options.forEach(option => {
          if (option.checked) {
            this.enabledFilters++;
            this.productService.filterDriveType(option);
          }
        })
      }
    })
    if (this.enabledFilters == 0) {
      this.productService.resetProducts();
    }
  }

  private isProcessor(product: PcPart): product is Processor {
    return product.type_name === 'Processor';
  }

  private isMotherboard(product: PcPart): product is Motherboard {
    return product.type_name === 'Motherboard';
  }

  private isMemory(product: PcPart): product is Memory {
    return product.type_name === 'Memory';
  }
  private isVideocard(product: PcPart): product is Videocard {
    return product.type_name === 'Processor';
  }

  private isPowersupply(product: PcPart): product is Powersupply {
    return product.type_name === 'Motherboard';
  }

  private isPccase(product: PcPart): product is Pccase {
    return product.type_name === 'Memory';
  }
  private isCpucooler(product: PcPart): product is Cpucooler {
    return product.type_name === 'Processor';
  }

  private isHarddrive(product: PcPart): product is Harddrive {
    return product.type_name === 'Motherboard';
  }

  addToCart(part: PcPart,  number = 1): void {
    const item: CartItem = {
      partType: part.type_name,
      partId: part.id,
      quantity: number,
      userId: "1"
    };

    this.cartService.addToCart(item).subscribe();
  }

  navigateToDetails(partId: number, partType: string) {
    this.router.navigateByUrl(`/product-details-component/${partId}/${partType}`)
  }
}


