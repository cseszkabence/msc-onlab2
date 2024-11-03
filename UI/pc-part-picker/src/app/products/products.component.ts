import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { RouterModule } from '@angular/router';
import { MatSliderModule } from '@angular/material/slider';
import { map, Observable } from 'rxjs';
import { Filter, filterProductsByName, ProductServiceService } from '../product-service.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { getManufacturers, Processor } from '../../model/Processor';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {

  filters: Filter[] = [];

  products$!: Observable<any[]>;
  allProducts!: any[];

  enabledFilters = 0;

  constructor(private productService: ProductServiceService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.fetchData();
    this.saveOriginalProductsList();
    this.products$.subscribe({
      next: (products) => this.productService.productsSubject.next(products)
    });
    this.productService.filters$.subscribe((filters) => {
      this.filters = filters;
    });
  }

  saveOriginalProductsList(): void {
    //this.allProducts$ = this.productService.originalProducts;
  }

  fetchData() {
    this.products$ = this.productService.products$;    
  }

  onChange(event: any, index: any, item: any) {
    this.enabledFilters = 0;
    this.filters[0].options.forEach(element => {
      if (element.checked == true) {
        this.enabledFilters++;
        this.productService.searchProducts(element.name);
        this.fetchData();
      }
    });
    if (this.enabledFilters == 0) {
      this.productService.resetProducts();
      return;
    }
  }

  initializeManufacturerFilter() {
    const manufacturerOptions = getManufacturers(this.productService.originalProducts);
      // Find or create the Manufacturer filter
      const manufacturerFilter = this.filters.find(f => f.name === 'Manufacturer');
      if (manufacturerFilter) {
        manufacturerFilter.options = manufacturerOptions;
      } else {
        this.filters.push({ name: 'Manufacturer', options: manufacturerOptions });
      }
  }


  openProductDetails(product: any): void {
    this.dialog.open(ProductDetailsComponent, {
      width: '400px',
      data: product
    });
  }
}


