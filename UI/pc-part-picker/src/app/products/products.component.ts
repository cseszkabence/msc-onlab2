import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { RouterModule } from '@angular/router';
import {MatSliderModule} from '@angular/material/slider';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  @Input() filters: any[] = [];  // Filter options passed into the component
  @Input() products: any[] = []; // Product list passed into the component

  constructor(public dialog: MatDialog) {}

  openProductDetails(product: any): void {
    this.dialog.open(ProductDetailsComponent, {
      width: '400px',  // You can adjust the width
      data: product     // Pass the product data to the dialog
    });
  }
}
