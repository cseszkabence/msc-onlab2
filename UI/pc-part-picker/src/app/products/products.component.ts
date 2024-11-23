import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { RouterModule } from '@angular/router';
import { MatSliderModule } from '@angular/material/slider';
import { map, Observable, Subscription } from 'rxjs';
import { Filter, filterProductsByName, ProductServiceService } from '../product-service.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {Processor } from '../../model/Processor';
import { pcpart } from '../../model/Pcpart';
import { Harddrive } from '../../model/Harddrive';
import { Cpucooler } from '../../model/Cpucooler';
import { Pccase } from '../../model/Pccase';
import { Powersupply } from '../../model/Powersupply';
import { Videocard } from '../../model/Videocard';
import { Memory } from '../../model/Memory';
import { Motherboard } from '../../model/Motherboard';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {

  private subscriptions: Subscription[] = [];  // Track all subscriptions

  filters: Filter[] = [];

  products$!: Observable<any[]>;
  allProducts!: pcpart[];

  enabledFilters = 0;

  constructor(private productService: ProductServiceService, public dialog: MatDialog) { }

  ngOnInit(): void {
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
    if(product.videocardid > 0) {
      return `${basePath}${product.chipset!}.jpg`;
    }
    else
    {
      return `${basePath}${product.name!}.jpg`;
    }
  }

  private getFolderName(product: pcpart): string {
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
      if(filter.name == "Manufacturer"){
        filter.options.forEach(option => {
          if(option.checked){
            this.enabledFilters++;
            this.productService.filterManufacturers(option);
          }
        })
      }
      else if(filter.name == "Series"){
        filter.options.forEach(option => {
          if(option.checked){
            this.enabledFilters++;
            this.productService.filterSeries(option);
          }
        })
      }
      else if(filter.name == "Sockets"){
        filter.options.forEach(option => {
          if(option.checked){
            this.enabledFilters++;
            this.productService.filterSocketType(option);
          }
        })
      }
      else if(filter.name == "Form Factors"){
        filter.options.forEach(option => {
          if(option.checked){
            this.enabledFilters++;
            this.productService.filterFormFactorType(option);
          }
        })
      }
      else if(filter.name == "Memory Types"){
        filter.options.forEach(option => {
          if(option.checked){
            this.enabledFilters++;
            this.productService.filterMemoryType(option);
          }
        })
      }
      else if(filter.name == "Chipsets"){
        filter.options.forEach(option => {
          if(option.checked){
            this.enabledFilters++;
            this.productService.filterChipsetType(option);
          }
        })
      }
      else if(filter.name == "Drive Types"){
        filter.options.forEach(option => {
          if(option.checked){
            this.enabledFilters++;
            this.productService.filterDriveType(option);
          }
        })
      }
    })
    if(this.enabledFilters==0){
      this.productService.resetProducts();
    }
  }

  openProductDetails(product: any): void {
    this.dialog.open(ProductDetailsComponent, {
      width: '400px',
      data: product
    });
  }
  private isProcessor(product: pcpart): product is Processor {
    return product.type_name === 'Processor';
  }
  
  private isMotherboard(product: pcpart): product is Motherboard {
    return product.type_name === 'Motherboard';
  }
  
  private isMemory(product: pcpart): product is Memory {
    return product.type_name === 'Memory';
  }
  private isVideocard(product: pcpart): product is Videocard {
    return product.type_name === 'Processor';
  }
  
  private isPowersupply(product: pcpart): product is Powersupply {
    return product.type_name === 'Motherboard';
  }
  
  private isPccase(product: pcpart): product is Pccase {
    return product.type_name === 'Memory';
  }
  private isCpucooler(product: pcpart): product is Cpucooler {
    return product.type_name === 'Processor';
  }
  
  private isHarddrive(product: pcpart): product is Harddrive {
    return product.type_name === 'Motherboard';
  }
  
}


