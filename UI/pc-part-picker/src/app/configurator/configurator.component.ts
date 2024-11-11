import { Component } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ProductServiceService } from '../product-service.service';
import { firstValueFrom } from 'rxjs';

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
})
export class ConfiguratorComponent {


  constructor(private productService: ProductServiceService) { }

  displayedColumns: string[] = ['demo-position', 'demo-weight'];
  dataSource = ELEMENT_DATA;

  async toggleBrowser(element: any) {
    const name = element.name;
    switch (name) {
      case "Processor": {
        element.browsableProducts = await firstValueFrom(this.productService.getProcessor());
        break;
      }
      case "Motherboard": {
        element.browsableProducts = await firstValueFrom(this.productService.getMotheboard());
        break;
      }
      case "Videocard": {
        element.browsableProducts = await firstValueFrom(this.productService.getVideocard());
        break;
      }
      case "Memory": {
        element.browsableProducts = await firstValueFrom(this.productService.getMemory());
        break;
      }
      case "Harddrive": {
        element.browsableProducts = await firstValueFrom(this.productService.getHarddrive());
        break;
      }
      case "PC Case": {
        element.browsableProducts = await firstValueFrom(this.productService.getCase());
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

  removeComponent(element: any) {
    element.productBrowserActive = false;
    element.productChosen = false;
    element.chosenProduct = undefined;
  }

  chooseComponent(element: any, product: any) {
    element.chosenProduct = product;
    element.productChosen = true;
    element.productBrowserActive = false;
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