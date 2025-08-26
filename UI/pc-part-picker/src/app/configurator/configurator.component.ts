import { Component } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ProductServiceService } from '../shared/services/products/product-service.service';
import { firstValueFrom, Observable } from 'rxjs';
import { Configuration } from '../../model/Configuration';
import { TableModule } from 'primeng/table';
import { PrimeTemplate } from 'primeng/api';
import { NgIf, CurrencyPipe, AsyncPipe } from '@angular/common';
import { Button } from 'primeng/button';
import { Listbox } from 'primeng/listbox';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth/auth.service';
import { MessageService } from 'primeng/api';
import { ConfiguratorService, UserConfig } from '../shared/services/configuration/configurator.service';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { BuildService } from '../shared/services/builder/builder.service';

interface PartRow {
  key: keyof Configuration;
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
  imports: [TableModule, PrimeTemplate, NgIf, Button, Listbox, CurrencyPipe, DialogModule, FormsModule, AsyncPipe]
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

  constructor(
    private productService: ProductServiceService,
    private router: Router,
    private auth: AuthService,
    private cfgSvc: ConfiguratorService,
    private msg: MessageService,
    private buildSvc: BuildService) {
    this.build$ = this.buildSvc.config$;

  }

  totalPrice: number | null | undefined;
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
    this.totalPrice = 0;
    this.dataSource.forEach((component) => {
      this.totalPrice = this.totalPrice + component.chosenProduct.price;
    });
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
    const build = this.configuration;      // your in-memory Configuration object
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