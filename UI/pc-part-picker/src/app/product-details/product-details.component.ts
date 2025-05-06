import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductServiceService } from '../shared/services/products/product-service.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { CartItem } from '../../model/CartItem';
import { PcPart } from '../../model/Pcpart';
import { ComparisonService } from '../shared/services/comparison/comparison.service';
import { CartService } from '../shared/services/cart/cart.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'product-details-component',
  imports: [CommonModule, ButtonModule, CardModule, ToastModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent {
  productId: number = 1; // Example ID
  productType: string = 'Processor'; // Example Type

  componentDetails!: any;
  cartService = inject(CartService)

  partId: number | null = null;
  partType: string | null = null;
  //componentDetails: BackendComponent | null = null;
  loading: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductServiceService,
    private comparisonService: ComparisonService,
    private messageService: MessageService
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

  getImagePath(product: any): string {
    return this.productService.getImagePath(product);
  }

  addToCart(part: PcPart, number = 1): void {
      const item: CartItem = {
        partType: this.partType!,
        partId: part.id,
        quantity: number,
        userId: "1"
      };
  
      this.cartService.addToCart(item).subscribe({
        next: () => {
          this.messageService.add({ severity: 'info', summary: 'Success!', detail: "Item added to cart successfully.", life: 2000 });
        },
        error: err => {
          this.messageService.add({ severity: 'error', summary: 'Error!', detail: "Failed to add to cart!", life: 2000 });
        }
      });
    }
  
    onCompare(part: PcPart): void {
      const result = this.comparisonService.addProduct(part);
      if (!result.success) {
        this.messageService.add({ severity: 'error', summary: 'Error!', detail: result.message, life: 2000 });
      } else {
        this.messageService.add({ severity: 'info', summary: 'Success!', detail: 'Product added to comparison list!', life: 2000 });
      }
    }
}
