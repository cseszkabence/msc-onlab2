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
import { SlotKey } from '../shared/services/configuration/configuration-slots';
import { Configuration } from '../../model/Configuration';
import { StrictCompatService } from '../shared/services/configuration/compat.service';
import { AssistantService } from '../shared/services/assistant/assistant.service';

type PartType =
  | 'processor'
  | 'motherboard'
  | 'videocard'
  | 'memory'
  | 'powersupply'
  | 'pccase'
  | 'storage'
  | 'cpucooler';
const PARTTYPE_TO_SLOT: Record<string, SlotKey> = {
  processor: 'processor', Processor: 'processor',
  motherboard: 'motherboard', Motherboard: 'motherboard',
  videocard: 'videocard', Videocard: 'videocard',
  memory: 'memory', Memory: 'memory',
  powersupply: 'powersupply', Powersupply: 'powersupply',
  pccase: 'pccase', Pccase: 'pccase',
  harddrive: 'harddrive', Harddrive: 'harddrive',
  storage: 'harddrive',     // if some routes use 'storage'
  cpucooler: 'cpucooler', Cpucooler: 'cpucooler'
};
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
    private buildSvc: BuildService,
    private ai: AssistantService,
    private msg: MessageService
  ) { }

  askAiFit() {
  const b = this.buildSvc.currentConfig;

  const body = {
    currentProductType: (this.partType ?? '').toLowerCase(), // e.g. 'gpu'
    currentProductId: this.partId!,
    cpuId: b.processor?.id,
    gpuId: b.videocard?.id,
    psuId: b.powersupply?.id,
    caseId: b.pccase?.id,
    motherboardId: b.motherboard?.id,
    memoryId: b.memory?.id,
    coolerId: b.cpucooler?.id,
    storageId: b.harddrive?.id
  };

  // this.ai.fit(body).subscribe({
  //   next: res => {
  //     this.msg.add({ severity: res.verdict === 'good' ? 'success' : 'info',
  //       summary: res.shortText, detail: (res.reasons || []).join(' · '), life: 4000 });
  //     // optionally open a dialog to show suggestions
  //   },
  //   error: _ => this.msg.add({ severity: 'error', summary: 'AI error', detail: 'Could not analyze this part.' })
  // });
}

  SLOT_LABEL: Record<SlotKey, string> = {
    processor: 'Processor',
    motherboard: 'Motherboard',
    videocard: 'GPU',
    memory: 'Memory',
    powersupply: 'Power Supply',
    pccase: 'Case',
    harddrive: 'Storage',
    cpucooler: 'CPU Cooler',
  };
  private getPartName(x: any): string {
    return x?.name ?? x?.model ?? x?.title ?? 'Item';
  }
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
    const key = PARTTYPE_TO_SLOT[this.partType ?? ''];
    if (!key || !this.componentDetails) {
      this.messageService.add({
        severity: 'warn', summary: 'Cannot add',
        detail: 'Unknown part type or item not loaded.', life: 2500
      });
      return;
    }

    const alreadyFilled = !!this.buildSvc.currentConfig[key];
    const patch = { [key]: this.componentDetails } as Partial<Configuration>;
    this.buildSvc.update(patch);

    this.messageService.add({
      severity: alreadyFilled ? 'info' : 'success',
      summary: `${this.SLOT_LABEL[key]} ${alreadyFilled ? 'replaced' : 'added'}`,
      detail: this.getPartName(this.componentDetails),
      life: 2500
    });
  }
  loadComponentDetails(id: number, type: string): void {
    this.loading = true;
    this.productService.getPart(id, type).subscribe({
      next: item => { this.componentDetails = item; this.loading = false; },
      error: err => { this.errorMessage = 'Failed to load item.'; this.loading = false; }
    });
  }

  getImagePath(product: any): string {
    return this.productService.getImagePath(product);
  }

  addToCart(part: PcPart, number = 1): void {
    const item: CartItem = {
      partType: this.partType!,
      partId: part.id,
      quantity: number,
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
