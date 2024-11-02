import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { RouterModule } from '@angular/router';
import { MatSliderModule } from '@angular/material/slider';
import { map, Observable } from 'rxjs';
import { filterProductsByName, ProductServiceService } from '../product-service.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { getManufacturers, Processor } from '../../model/Processor';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {

  filters = [
    { name: 'Manufacturer', options: [] },
    { name: 'Series', options: [{ name: 'Series A', checked: false }, { name: 'Series B', checked: false }] }
  ];

  products$!: Observable<any[]>;
  allProducts$!: Observable<any[]>;

  enabledFilters = 0;
  filteredProducts$!: Observable<any[]>;

  constructor(private productService: ProductServiceService, public dialog: MatDialog) { }

  ngOnInit(): void {
    //this.productService.chooseProduct(0);
    this.fetchData();
    this.saveOriginalProductsList();
    this.products$.subscribe({
      next: (products) => this.productService.productsSubject.next(products)
    });
    
    this.initializeManufacturerFilter();
  }

  saveOriginalProductsList(): void {
    this.allProducts$ = this.products$;
  }

  fetchData() {
    this.products$ = this.productService.products$;
  }

  onChange(event: any, index: any, item: any) {
    this.enabledFilters = 0;
    //this.filteredProducts$ = this.allProducts$;
    this.filters[0].options.forEach(element => {
      if (element.checked == true) {
        this.enabledFilters++;
        this.productService.searchProducts(element.name);
        this.fetchData();
        //this.filteredProducts$ = filterProductsByName(this.filteredProducts$, element.name);
      }
    });
    if (this.enabledFilters == 0) {
      this.products$ = this.allProducts$;
      return;
    }
    //this.products$ = this.filteredProducts$;
    //this.fetchData();
  }

  initializeManufacturerFilter() {
    this.products$.subscribe(async (processors) => {
      const manufacturerOptions = getManufacturers(processors);
      // Find or create the Manufacturer filter
      const manufacturerFilter = this.filters.find(f => f.name === 'Manufacturer');
      if (manufacturerFilter) {
        manufacturerFilter.options = manufacturerOptions;
      } else {
        this.filters.push({ name: 'Manufacturer', options: manufacturerOptions });
      }
    });
  }


  openProductDetails(product: any): void {
    this.dialog.open(ProductDetailsComponent, {
      width: '400px',
      data: product
    });
  }
}


