import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { RouterModule } from '@angular/router';
import { MatSliderModule } from '@angular/material/slider';
import { map, Observable } from 'rxjs';
import { ProductServiceService } from '../product-service.service';
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

  products$ = this.productService.products$;

  priceRanges = [
    { label: 'Under $50', range: [0, 50] },
    { label: '$50 - $100', range: [50, 100] },
    { label: '$100 - $200', range: [100, 200] },
    { label: 'Above $200', range: [200, Infinity] }
  ];
  availableBrands = ['BrandA', 'BrandB', 'BrandC'];


  constructor(private productService: ProductServiceService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.productService.chooseProduct(0);
  }

  onChange(event: any, index: any, item: any) {
    const filteredProducts$ = filterProductsByName(this.products$, item.name);
    filteredProducts$.subscribe(filteredProducts => {
      console.log('Filtered Products:', filteredProducts);
    });
    this.products$ = filteredProducts$;
  }
  
  // Set the brand filter
  setBrandFilter(brand: string): void {
    this.productService.setFilter('brand', brand);
  }

  // Set the price range filter
  setPriceRangeFilter(range: { label: string, range: number[] }): void {
    this.productService.setFilter('priceRange', range.range);
  }

  openProductDetails(product: any): void {
    this.dialog.open(ProductDetailsComponent, {
      width: '400px',
      data: product
    });
  }
}
function filterProductsByName<T extends { name: string }>(
    products$: Observable<T[]>,
    searchTerm: string
  ): Observable<T[]> {
    return products$.pipe(
      map(products => products.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  }
