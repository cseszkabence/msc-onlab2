import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { map, Observable, Subscription } from 'rxjs';
import { Filter, filterProductsByName, ProductServiceService } from '../shared/services/products/product-service.service';
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
import { PrimeTemplate, MessageService } from 'primeng/api';
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
import { ComparisonService } from '../shared/services/comparison/comparison.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
  standalone: true,
  imports: [
    DataView,
    ToastModule,
    ScrollTopModule,
    ButtonModule,
    SelectButton,
    CommonModule,
    Splitter,
    Accordion,
    NgFor,
    AccordionPanel,
    Ripple, AccordionHeader, AccordionContent, Checkbox, FormsModule, NgIf, Card, PrimeTemplate, Button, AsyncPipe, CurrencyPipe]
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
  prevComp?: string;
  category!: string;
  parts: any[] = [];
  enabledFilters = 0;

  constructor(
    private productService: ProductServiceService,
    private router: Router,
    private comparisonService: ComparisonService,
    private messageService: MessageService,
    private route: ActivatedRoute,

  ) {
    const nav = this.router.getCurrentNavigation();
    const from = nav?.extras.state?.['from']
      || (history.state && history.state.from);
    const product = nav?.extras.state?.['prod']
    if (from == 'configurator-component') {
      this.chooseProductAsnyc(product)
      this.onChange();
    }
  }

  async chooseProductAsnyc(product: string) {
    await this.productService.chooseProduct(product);
  }

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
    this.route.paramMap.subscribe(pm => {
      this.category = pm.get('category') || 'all';
      this.chooseProductAsnyc(this.category)
    });
  }

  loadPartsFor(cat: string) {
    switch (cat) {
      case 'processor':
        this.productService.getProcessor().subscribe(list => this.parts = list);
        break;
      case 'motherboard':
        this.productService.getMotherboard().subscribe(list => this.parts = list);
        break;
      case 'memory':
        this.productService.getMemory().subscribe(list => this.parts = list);
        break;
      case 'videocard':
      this.chooseProductAsnyc(cat)
        break;
      case 'storage':
        this.productService.getHarddrive().subscribe(list => this.parts = list);
        break;
      case 'powersupply':
        this.productService.getPowersupply().subscribe(list => this.parts = list);
        break;
      case 'case':
        this.productService.getCase().subscribe(list => this.parts = list);
        break;
      case 'cpucooler':
        this.productService.getProcessorCooler().subscribe(list => this.parts = list);
        break;
      default:
        this.parts = [];
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());  // Unsubscribe from all
  }

  saveOriginalProductsList(): void {
    //this.allProducts$ = this.productService.originalProducts;
  }

  getImagePath(product: any): string {
    return this.productService.getImagePath(product);
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

  onChange() {
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
    return product.type_name === 'Videocard';
  }

  private isPowersupply(product: PcPart): product is Powersupply {
    return product.type_name === 'Powersupply';
  }

  private isPccase(product: PcPart): product is Pccase {
    return product.type_name === 'Pccase';
  }
  private isCpucooler(product: PcPart): product is Cpucooler {
    return product.type_name === 'Cpucooler';
  }

  private isHarddrive(product: PcPart): product is Harddrive {
    return product.type_name === 'Harddrive';
  }

  addToCart(part: PcPart, number = 1): void {
    const item: CartItem = {
      partType: part.type_name,
      partId: part.id,
      quantity: number,
      userId: "1"
    };

    this.cartService.addToCart(item).subscribe({
      next: () => {
        this.messageService.add({ severity: 'info', summary: 'Success!', detail: "Item added to cart successfully.", life: 2000 });
      },
      error: err => {
        this.messageService.add({ severity: 'error', summary: 'Error!', detail: "Failed to add to cart!", life: 2000 });
      }
    });
  }

  navigateToDetails(partId: number, partType: string) {
    this.router.navigateByUrl(`/product-details-component/${partId}/${partType}`)
  }

  onCompare(part: PcPart): void {
    const result = this.comparisonService.addProduct(part);
    if (!result.success) {
      this.messageService.add({ severity: 'error', summary: 'Error!', detail: result.message, life: 2000 });
    } else {
      this.messageService.add({ severity: 'info', summary: 'Success!', detail: 'Product added to comparison list!', life: 2000 });
    }
  }
}


