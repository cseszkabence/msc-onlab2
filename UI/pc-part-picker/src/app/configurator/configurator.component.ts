import { Harddrive } from './../../model/Harddrive';
import { Component } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ProductServiceService } from '../shared/services/products/product-service.service';
import { finalize, firstValueFrom, forkJoin, Observable } from 'rxjs';
import { Configuration } from '../../model/Configuration';
import { TableModule } from 'primeng/table';
import { PrimeTemplate } from 'primeng/api';
import { NgIf, CurrencyPipe, AsyncPipe } from '@angular/common';
import { Button, ButtonModule } from 'primeng/button';
import { Listbox, ListboxModule } from 'primeng/listbox';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth/auth.service';
import { MessageService } from 'primeng/api';
import { ConfiguratorService, UserConfig } from '../shared/services/configuration/configurator.service';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { BuildService } from '../shared/services/builder/builder.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CartItem } from '../../model/CartItem';
import { CartService } from '../shared/services/cart/cart.service';
import { SlotKey } from '../shared/services/configuration/configuration-slots';
import { StrictCompatService } from '../shared/services/configuration/compat.service';
import { AssistantService } from '../shared/services/assistant/assistant.service';

interface PartRow {
  key: SlotKey;
  label: string;
  route: string;            // where to navigate when choosing
}

@Component({
  selector: 'app-configurator',
  templateUrl: './configurator.component.html',
  styleUrl: './configurator.component.css',
  animations: [
    trigger('slideDownUp', [
      state('void', style({ height: '0px', opacity: 0 })),
      state('*', style({ height: '*', opacity: 1 })),
      transition('void <=> *', animate('300ms ease-in-out')),
    ]),
  ],
  imports: [TableModule, PrimeTemplate, NgIf, Button, Listbox, CurrencyPipe, DialogModule, FormsModule, AsyncPipe, ListboxModule, ButtonModule, ProgressSpinnerModule]
})
export class ConfiguratorComponent {

  displaySaveDialog = false;
  configName = '';
  build$: Observable<Configuration> = this.buildSvc.config$ as Observable<Configuration>;
  parts: PartRow[] = [
    { key: 'processor', label: 'Processor', route: 'processor' },
    { key: 'motherboard', label: 'Motherboards', route: 'motherboard' },
    { key: 'videocard', label: 'GPU', route: 'videocard' },
    { key: 'memory', label: 'RAM', route: 'memory' },
    { key: 'powersupply', label: 'PSU', route: 'powersupply' },
    { key: 'pccase', label: 'Case', route: 'case' },
    { key: 'harddrive', label: 'Storage', route: 'storage' },
    { key: 'cpucooler', label: 'Cooler', route: 'cpucooler' },
  ];

  // dialog state
  displayLoadDialog = false;
  loadingConfigs = false;
  configs: UserConfig[] = [];
  selectedConfigId?: number;
  reviewText: any;
  displayReviewDialog: any;
  isReviewLoading = false;

  constructor(
    private partSvc: ProductServiceService,
    private router: Router,
    private auth: AuthService,
    private cfgSvc: ConfiguratorService,
    private msg: MessageService,
    private buildSvc: BuildService,
    private cartSvc: CartService,
    private compatSvc: StrictCompatService,
    private ai: AssistantService
  ) {
    this.build$ = this.buildSvc.config$;

  }

  totalPrice: number = 0;
  displayedColumns: string[] = ['demo-position', 'demo-weight'];
  dataSource = ELEMENT_DATA;
  configuration: Configuration = {
    processor: undefined,
    motherboard: undefined,
    videocard: undefined,
    memory: undefined,
    harddrive: undefined,
    pccase: undefined,
    powersupply: undefined,
    cpucooler: undefined
  }

  totalPriceCalculator() {
    const b = this.buildSvc.currentConfig; // the live selection
    const keys = [
      'processor', 'motherboard', 'videocard', 'memory',
      'harddrive', 'powersupply', 'pccase', 'cpucooler'
    ] as const;

    let sum = 0;
    for (const k of keys) {
      const price = (b as any)[k]?.price;
      if (price != null) sum += this.toIntPrice(price);
    }
    this.totalPrice = sum;
  }

  // same integer-only helper
  private toIntPrice(v: any): number {
    if (typeof v === 'number') return Math.trunc(v);
    if (typeof v === 'string') {
      const n = Number(v.replace(/[, ]/g, ''));
      return Number.isFinite(n) ? Math.trunc(n) : 0;
    }
    return 0;
  }

  onSaveClick() {
    if (!this.auth.isLoggedIn()) {
      this.msg.add({
        severity: 'warn',
        summary: 'Login Required',
        detail: 'Please register or login to save your build.',
        life: 5000
      });
      return;
    }
    // open the naming dialog
    this.displaySaveDialog = true;
    this.configName = '';
  }

  choose(row: PartRow) {
    this.router.navigate(['/products', row.route]);
  }

  saveConfig() {
    // assemble the DTO matching our backend shape
    const build = this.buildSvc.currentConfig;      // your in-memory Configuration object
    const payload: Partial<UserConfig> = {
      name: this.configName,
      motherboardId: build.motherboard?.id,
      processorId: build.processor?.id,
      videocardId: build.videocard?.id,
      memoryId: build.memory?.id,
      powersupplyId: build.powersupply?.id,
      caseId: build.pccase?.id,
      storageId: build.harddrive?.id,
      coolerId: build.cpucooler?.id
    };
    this.cfgSvc.create(payload).subscribe({
      next: () => {
        this.msg.add({
          severity: 'success',
          summary: 'Saved',
          detail: `Build “${this.configName}” saved!`,
          life: 3000
        });
        this.displaySaveDialog = false;
      },
      error: () => {
        this.msg.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not save your build. Try again later.',
          life: 5000
        });
      }
    });
  }

  openLoadDialog() {
    if (!this.auth.isLoggedIn()) {
      this.msg.add({
        severity: 'warn',
        summary: 'Login Required',
        detail: 'Please login to access your saved configurations.',
        life: 4000
      });
      // optional: navigate to login
      // this.router.navigate(['/login']);
      return;
    }

    this.loadingConfigs = true;
    this.cfgSvc.list()
      .pipe(finalize(() => (this.loadingConfigs = false)))
      .subscribe({
        next: (list) => {
          this.configs = list;
          this.displayLoadDialog = true;
        },
        error: () => {
          this.msg.add({
            severity: 'error',
            summary: 'Could not load configurations',
            life: 4000
          });
        }
      });
  }

  onLoadSelected() {
    const cfg = this.configs.find(c => c.id === this.selectedConfigId);
    if (!cfg) return;

    this.loadConfigIntoBuild(cfg);
    this.displayLoadDialog = false;
    this.msg.add({
      severity: 'success',
      summary: `Loaded “${cfg.name}”`,
      life: 2500
    });
  }

  /** Fetch parts by IDs from backend, then push into BuildService */
  private loadConfigIntoBuild(cfg: UserConfig) {
    // Build a set of HTTP calls only for non-null IDs
    const calls: { [k: string]: Observable<any> } = {};

    if (cfg.processorId) calls['processor'] = this.partSvc.getPart(cfg.processorId, 'Processor');
    if (cfg.motherboardId) calls['motherboard'] = this.partSvc.getPart(cfg.motherboardId, 'Motherboard');
    if (cfg.videocardId) calls['videocard'] = this.partSvc.getPart(cfg.videocardId, 'Videocard');
    if (cfg.memoryId) calls['memory'] = this.partSvc.getPart(cfg.memoryId, 'Memory');
    if (cfg.powersupplyId) calls['powersupply'] = this.partSvc.getPart(cfg.powersupplyId, 'Powersupply');
    if (cfg.caseId) calls['pccase'] = this.partSvc.getPart(cfg.caseId, 'Pccase');
    if (cfg.storageId) calls['storage'] = this.partSvc.getPart(cfg.storageId, 'Harddrive');
    if (cfg.coolerId) calls['cpucooler'] = this.partSvc.getPart(cfg.coolerId, 'Cpucooler');

    if (Object.keys(calls).length === 0) {
      // nothing selected in this config; just clear
      this.buildSvc.reset();
      return;
    }

    forkJoin(calls).subscribe({
      next: (parts: any) => {
        // Push everything into your app-wide build state
        // parts has keys matching the ones we set above
        this.buildSvc.reset();
        this.buildSvc.update(parts as Partial<Configuration>);
      },
      error: () => {
        this.msg.add({
          severity: 'error',
          summary: 'Failed to load parts for that configuration.',
          life: 4000
        });
      }
    });
  }

  removePart(row: PartRow) {
    this.buildSvc.remove(row.key);
  }

  addAllToCart() {
    // 2) read current build
    const b = this.buildSvc.currentConfig;

    // 3) map selected parts → CartItemDto[]
    const items: CartItem[] = [];

    const pushIf = (exists: any, partType: string, getId: (x: any) => number | undefined) => {
      if (exists) {
        const id = getId(exists);
        if (typeof id === 'number') items.push({ partType, partId: id, quantity: 1, userId: '2' });
      }
    };

    pushIf(b.processor, 'Processor', x => x.id ?? x.processorId ?? x.ProcessorId);
    pushIf(b.motherboard, 'Motherboard', x => x.id ?? x.motherboardId ?? x.MotherboardId);
    pushIf(b.videocard, 'Videocard', x => x.id ?? x.videocardId ?? x.VideocardId);
    pushIf(b.memory, 'Memory', x => x.id ?? x.memoryId ?? x.MemoryId);
    pushIf(b.powersupply, 'Powersupply', x => x.id ?? x.powersupplyId ?? x.PowerSupplyId ?? x.PowersupplyId);
    pushIf(b.pccase, 'Pccase', x => x.id ?? x.pccaseId ?? x.CaseId);
    pushIf(b.harddrive, 'Harddrive', x => x.id ?? x.harddriveId ?? x.StorageId ?? x.HarddriveId);
    pushIf(b.cpucooler, 'Cpucooler', x => x.id ?? x.cpucoolerId ?? x.CoolerId);

    if (items.length === 0) {
      this.msg.add({
        severity: 'info',
        summary: 'Nothing to add',
        detail: 'Select some components first.',
        life: 3000,
      });
      return;
    }

    // 4) call backend (one request per item, in parallel)
    this.cartSvc.addManyToCart(items).subscribe({
      next: () => {
        this.msg.add({
          severity: 'success',
          summary: 'Added to cart',
          detail: `${items.length} item(s) added.`,
          life: 3000,
        });
      },
      error: (err) => {
        console.error('Add to cart failed', err);
        this.msg.add({
          severity: 'error',
          summary: 'Could not add to cart',
          detail: 'Please try again.',
          life: 4000,
        });
      }
    });
  }
  checkCompat() {
    const b = this.buildSvc.currentConfig;
    this.compatSvc.check({
      cpuId: b.processor?.id,
      motherboardId: b.motherboard?.id,
      memoryId: b.memory?.id,
      caseId: b.pccase?.id
    }).subscribe(res => {
      if (res.ok) {
        this.msg.add({ severity: 'success', summary: 'Compatibility', detail: 'No compatibility errors found!', life: 4000 })
      }
      else if (!res.ok) {
        // show deterministic errors; block “save” if you want
        res.errors.forEach(e => this.msg.add({ severity: 'error', summary: 'Compatibility', detail: e, life: 4000 }));
      } else {
        // Optionally: call your Gemini explain endpoint for the rest (GPU fit, PSU, summary)
        // this.ai.explain({ facts: res.facts, gpuId: b.videocard?.id, psuId: b.powersupply?.id, ... })
      }
    });

  }

  askAiReview() {
    const b = this.buildSvc.currentConfig;

    const body = {
      cpu: b.processor?.name,
      gpu: b.videocard?.chipset,
      motherboard: b.motherboard?.name,
      memory: b.memory?.name,
      storage: b.harddrive?.name,
      powersupply: b.powersupply?.name,
      pccase: b.pccase?.name,
      cpucooler: b.cpucooler?.name,
      // optionally pass user intent:
      // targetUse: '1080p gaming', budgetTier: 'mid'
    };

    this.reviewText = undefined;
    this.displayReviewDialog = true;   // open dialog immediately
    this.isReviewLoading = true;       // show loader

    this.ai.reviewByNames(body)
      .pipe(finalize(() => this.isReviewLoading = false))
      .subscribe({
        next: (text: string) => { this.reviewText = text;
          this.isReviewLoading = false;
         },
        error: _ => {
          this.displayReviewDialog = false;
          this.msg.add({ severity: 'error', summary: 'AI error', detail: 'Could not review your build.' });
        }
      });
  }


  toggleBrowser(product: string) {
    this.router.navigate(
      ["/products"],
      { state: { from: 'configurator-component', prod: product } });
    /*  switch (name) {
       case "Processor": {
         element.browsableProducts = await firstValueFrom(this.productService.getProcessor());
         break;
       }
       case "Motherboard": {
         element.browsableProducts = await firstValueFrom(this.productService.getMotheboard());
         const filteredProducts = element.browsableProducts.filter(product =>
           product.socketType == this.configuration.processor?.socketType
         );
         element.browsableProducts = filteredProducts;
         break;
       }
       case "Videocard": {
         element.browsableProducts = await firstValueFrom(this.productService.getVideocard());
         break;
       }
       case "Memory": {
         element.browsableProducts = await firstValueFrom(this.productService.getMemory());
         const filteredProducts = element.browsableProducts.filter(product =>
           product.typeNavigation == this.configuration.motherboard?.memoryType
         );
         element.browsableProducts = filteredProducts;
         break;
       }
       case "Harddrive": {
         element.browsableProducts = await firstValueFrom(this.productService.getHarddrive());
         break;
       }
       case "PC Case": {
         element.browsableProducts = await firstValueFrom(this.productService.getCase());
         const filteredProducts = element.browsableProducts.filter(product =>
           product.formFactorType == this.configuration.motherboard?.formFactoryType
         );
         element.browsableProducts = filteredProducts;
         break;
       }
       case "Powersupply": {
         element.browsableProducts = await firstValueFrom(this.productService.getPowersupply());
         break;
       }
       case "CPU Cooler": {
         element.browsableProducts = await firstValueFrom(this.productService.getProcessorCooler());
         break;
       }
       default: {
         break;
       }
     }
     element.productBrowserActive = !element.productBrowserActive;
     //element.browsableProducts = this.productService.mockData; */
  }

  removeComponent(element: PeriodicElement) {
    element.productBrowserActive = false;
    element.productChosen = false;
    element.chosenProduct = undefined;
    const name = element.name;
    switch (name) {
      case "Processor": {
        this.configuration.processor = undefined;
        break;
      }
      case "Motherboard": {
        this.configuration.motherboard = undefined;
        break;
      }
      case "Videocard": {
        this.configuration.videocard = undefined;
        break;
      }
      case "Memory": {
        this.configuration.memory = undefined;
        break;
      }
      case "Harddrive": {
        this.configuration.harddrive = undefined;
        break;
      }
      case "PC Case": {
        this.configuration.pccase = undefined;
        break;
      }
      case "Powersupply": {
        this.configuration.powersupply = undefined;
        break;
      }
      case "CPU Cooler": {
        this.configuration.cpucooler = undefined;
        break;
      }
      default: {
        break;
      }
    }
    this.totalPriceCalculator();
  }

  async chooseComponent(element: PeriodicElement, product: any) {
    element.chosenProduct = product;
    element.productChosen = true;
    element.productBrowserActive = false;
    const name = element.name;
    switch (name) {
      case "Processor": {
        this.configuration.processor = product;
        break;
      }
      case "Motherboard": {
        this.configuration.motherboard = product;
        break;
      }
      case "Videocard": {
        this.configuration.videocard = product;
        break;
      }
      case "Memory": {
        this.configuration.memory = product;
        break;
      }
      case "Harddrive": {
        this.configuration.harddrive = product;
        break;
      }
      case "PC Case": {
        this.configuration.pccase = product;
        break;
      }
      case "Powersupply": {
        this.configuration.powersupply = product;
        break;
      }
      case "CPU Cooler": {
        this.configuration.cpucooler = product;
        break;
      }
      default: {
        break;
      }
    }
    this.totalPriceCalculator();
  }
}

export interface PeriodicElement {
  name: string;
  productBrowserActive: boolean;
  productChosen: boolean
  browsableProducts: any[];
  chosenProduct: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    name: "Processor",
    productBrowserActive: false,
    productChosen: false,
    browsableProducts: [],
    chosenProduct: undefined
  },
  {
    name: "Motherboard", productBrowserActive: false,
    productChosen: false,
    browsableProducts: [],
    chosenProduct: undefined
  },
  {
    name: "Videocard", productBrowserActive: false,
    productChosen: false,
    browsableProducts: [],
    chosenProduct: undefined
  },
  {
    name: "Memory", productBrowserActive: false,
    productChosen: false,
    browsableProducts: [],
    chosenProduct: undefined
  },
  {
    name: "Harddrive", productBrowserActive: false,
    productChosen: false,
    browsableProducts: [],
    chosenProduct: undefined
  },
  {
    name: "PC Case", productBrowserActive: false,
    productChosen: false,
    browsableProducts: [],
    chosenProduct: undefined
  },
  {
    name: "Powersupply", productBrowserActive: false,
    productChosen: false,
    browsableProducts: [],
    chosenProduct: undefined
  },
  {
    name: "CPU Cooler", productBrowserActive: false,
    productChosen: false,
    browsableProducts: [],
    chosenProduct: undefined
  },
];