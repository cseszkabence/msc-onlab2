import { Component } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ProductServiceService } from '../shared/products/product-service.service';
import { firstValueFrom } from 'rxjs';
import { Configuration } from '../../model/Configuration';
import { TableModule } from 'primeng/table';
import { PrimeTemplate } from 'primeng/api';
import { NgIf, CurrencyPipe } from '@angular/common';
import { Button } from 'primeng/button';
import { Listbox } from 'primeng/listbox';

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
    imports: [TableModule, PrimeTemplate, NgIf, Button, Listbox, CurrencyPipe]
})
export class ConfiguratorComponent {

  constructor(private productService: ProductServiceService) {
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

  async toggleBrowser(element: PeriodicElement) {
    const name = element.name;
    switch (name) {
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
    //element.browsableProducts = this.productService.mockData;
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