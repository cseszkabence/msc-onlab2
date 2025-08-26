import { Harddrive } from './../../model/Harddrive';
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
import { BuildService } from '../shared/services/builder/builder.service';
import { Processor } from '../../model/Processor';
import { Memory } from '../../model/Memory';
import { Motherboard } from '../../model/Motherboard';
import { Videocard } from '../../model/Videocard';
import { Cpucooler } from '../../model/Cpucooler';
import { Pccase } from '../../model/Pccase';
import { Powersupply } from '../../model/Powersupply';

type PartType =
  | 'processor'
  | 'motherboard'
  | 'videocard'
  | 'memory'
  | 'powersupply'
  | 'pccase'
  | 'storage'
  | 'cpucooler';

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
  product!: any;       // your product model

  constructor(
    private route: ActivatedRoute,
    private productService: ProductServiceService,
    private comparisonService: ComparisonService,
    private messageService: MessageService,
    private buildSvc: BuildService

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
addToBuild() {
    // Narrow the type so TS knows which field to update
    switch (this.partType) {
      case 'Processor':
        this.buildSvc.update({ processor: this.componentDetails as Processor });
        break;
      case 'Motherboard':
        this.buildSvc.update({ motherboard: this.componentDetails as Motherboard });
        break;
      case 'Videocard':
        this.buildSvc.update({ videocard: this.componentDetails as Videocard });
        break;
      case 'Memory':
        this.buildSvc.update({ memory: this.componentDetails as Memory });
        break;
      case 'Powersupply':
        this.buildSvc.update({ powersupply: this.componentDetails as Powersupply });
        break;
      case 'Pccase':
        this.buildSvc.update({ pccase: this.componentDetails as Pccase });
        break;
      case 'Harddrive':
        this.buildSvc.update({ harddrive: this.componentDetails as Harddrive });
        break;
      case 'Cpucooler':
        this.buildSvc.update({ cpucooler: this.componentDetails as Cpucooler });
        break;
    }
  }
  loadComponentDetails(id: number, type: string): void {
    this.loading = true;
    this.componentDetails = this.productService.getPart(id, type).subscribe(item => this.componentDetails = item);
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
