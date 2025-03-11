import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
    selector: 'app-product-details',
    templateUrl: './product-details.component.html',
    styleUrl: './product-details.component.css',
    standalone: false
})
export class ProductDetailsComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public product: any) {}
}
