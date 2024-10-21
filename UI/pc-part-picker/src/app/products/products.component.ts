import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { RouterModule } from '@angular/router';
import { MatSliderModule } from '@angular/material/slider';
import { map, Observable } from 'rxjs';
import { filterProductsByName, ProductServiceService } from '../product-service.service';
import { MatCheckboxChange } from '@angular/material/checkbox';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {

  filters = [
    { name: 'Manufacturer', options: [{ name: 'AMD', checked: false }, { name: 'Intel', checked: false }] },
    { name: 'Price', options: [{ name: 'Under $500', checked: false }, { name: '$500 - $1000', checked: false }] }
  ];

  products$!: Observable<any[]>;
  allProducts$!: Observable<any[]>;

  enabledFilters = 0;
  filteredProducts$!: Observable<any[]>;

  constructor(private productService: ProductServiceService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.productService.chooseProduct(0);
    this.fetchData();
    this.saveOriginalProductsList();
    this.products$.subscribe({
      next: (products) => this.productService.productsSubject.next(products)
    });
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
        this.productService.searchProducts( element.name);
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

  openProductDetails(product: any): void {
    this.dialog.open(ProductDetailsComponent, {
      width: '400px',
      data: product
    });
  }
}


