import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductServiceService } from '../shared/services/products/product-service.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'product-details-component',
  imports: [CommonModule, ButtonModule, CardModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent {
  productId: number = 1; // Example ID
  productType: string = 'Processor'; // Example Type

  componentDetails!: any;

  partId: number | null = null;
  partType: string | null = null;
  //componentDetails: BackendComponent | null = null;
  loading: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductServiceService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.partId = Number(params.get('id'));
      this.partType = params.get('type');

      if (this.partId && this.partType) {
        this.loadComponentDetails(this.partId, this.partType);
      } else {
        this.errorMessage = 'Invalid parameters.';
        this.loading = false;
      }
    });
  }

  loadComponentDetails(id: number, type: string): void {
    this.loading = true;
    this.componentDetails = this.productService.getPart(id, type).subscribe(item=> this.componentDetails = item);
  }
}
