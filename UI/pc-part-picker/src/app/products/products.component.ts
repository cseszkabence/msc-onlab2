import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { RouterModule } from '@angular/router';
import { MatSliderModule } from '@angular/material/slider';
import { map, Observable, Subscription } from 'rxjs';
import { Filter, filterProductsByName, ProductServiceService } from '../product-service.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {Processor } from '../../model/Processor';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {

  private subscriptions: Subscription[] = [];  // Track all subscriptions

  filters: Filter[] = [];

  products$!: Observable<any[]>;
  allProducts!: any[];

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
}


