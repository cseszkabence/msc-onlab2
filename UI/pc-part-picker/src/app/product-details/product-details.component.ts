import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgIf, CurrencyPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';


@Component({
    selector: 'app-product-details',
    templateUrl: './product-details.component.html',
    styleUrl: './product-details.component.css',
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, NgIf, MatDialogActions, MatButton, MatDialogClose, CurrencyPipe]
})
export class ProductDetailsComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public product: any) {}
}
