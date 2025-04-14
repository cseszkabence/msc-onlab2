import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Motherboard } from '../../../../model/Motherboard';
import { BehaviorSubject, distinctUntilChanged, filter, firstValueFrom, map, Observable } from 'rxjs';
import { Videocard } from '../../../../model/Videocard';
import { Pccase } from '../../../../model/Pccase';
import { Memory } from '../../../../model/Memory';
import { Harddrive } from '../../../../model/Harddrive';
import { Powersupply } from '../../../../model/Powersupply';
import { Cpucooler } from '../../../../model/Cpucooler';
import { Processor } from '../../../../model/Processor';
import { PcPart } from '../../../../model/Pcpart';

export interface FilterOption {
  name: string;
  checked: boolean;
}

export interface Filter {
  name: string;
  options: FilterOption[];
}


@Injectable({
  providedIn: 'root'
})

export class ProductServiceService {
  private APIUrl = "http://localhost:5147/api"
  productsSubject = new BehaviorSubject<PcPart[]>([]);
  products$ = this.productsSubject.asObservable().pipe(
    distinctUntilChanged() // Ensures emissions happen only when data changes
  );

  private filtersSubject = new BehaviorSubject<Filter[]>([]);
  filters$: Observable<Filter[]> = this.filtersSubject.asObservable();

  originalProducts!: any[];
  filteredProducts!: any[];

  constructor(
    private httpClient: HttpClient
  ) { }

  async searchProducts(searchQuery: string): Promise<void> {
    if (searchQuery == '') {
      this.productsSubject.next(this.originalProducts);
      return;
    }
    const filteredProducts = this.originalProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    this.productsSubject.next(filteredProducts);
  }

  filterManufacturers(filterOption: FilterOption) {
    if (this.filteredProducts == undefined) {
      this.filteredProducts = this.originalProducts.filter(product =>
        product.manufacturerType == filterOption.name
      );
    } else {
      const newFilteredProducts = this.originalProducts.filter(product =>
        product.manufacturerType == filterOption.name
      );
      this.filteredProducts = this.filteredProducts.concat(newFilteredProducts);
    }

    this.productsSubject.next(this.filteredProducts);
  }

  filterSeries(filterOption: FilterOption) {
    if (this.filteredProducts == undefined) {
      this.filteredProducts = this.originalProducts.filter(product =>
        product.seriesType == filterOption.name
      );
    } else {
      const newFilteredProducts = this.originalProducts.filter(product =>
        product.seriesType == filterOption.name
      );
      this.filteredProducts = this.filteredProducts.concat(newFilteredProducts);
    }
    this.productsSubject.next(this.filteredProducts);
  }

  filterSocketType(filterOption: FilterOption) {
    if (this.filteredProducts == undefined) {
      this.filteredProducts = this.originalProducts.filter(product =>
        product.socketType == filterOption.name
      );
    } else {
      const newFilteredProducts = this.originalProducts.filter(product =>
        product.socketType == filterOption.name
      );
      this.filteredProducts = this.filteredProducts.concat(newFilteredProducts);
    }
    this.productsSubject.next(this.filteredProducts);
  }

  filterFormFactorType(filterOption: FilterOption) {
    if (this.filteredProducts == undefined) {
      if (isMotherboard(this.originalProducts[0])) {
        this.filteredProducts = this.originalProducts.filter(product =>
          product.formFactoryType == filterOption.name
        );
      } else {
        this.filteredProducts = this.originalProducts.filter(product =>
          product.formFactorType == filterOption.name
        )
      }
    } else {
      var newFilteredProducts: any[];
      if (isMotherboard(this.originalProducts[0])) {
        newFilteredProducts = this.originalProducts.filter(product =>
          product.formFactoryType == filterOption.name
        );
      } else if (isPSU(this.originalProducts[0])) {
        newFilteredProducts = this.originalProducts.filter(product =>
          product.formFactor == filterOption.name
        )
      } else {
        newFilteredProducts = this.originalProducts.filter(product =>
          product.formFactorType == filterOption.name
        )
      }
      this.filteredProducts = this.filteredProducts.concat(newFilteredProducts);
    }
    this.productsSubject.next(this.filteredProducts);
  }

  filterMemoryType(filterOption: FilterOption) {
    if (this.filteredProducts == undefined) {
      if (isMotherboard(this.originalProducts[0])) {
        this.filteredProducts = this.originalProducts.filter(product =>
          product.memoryType == filterOption.name
        );
      } else {
        this.filteredProducts = this.originalProducts.filter(product =>
          product.typeNavigation == filterOption.name
        )
      }
    } else {
      var newFilteredProducts: any[];
      if (isMotherboard(this.originalProducts[0])) {
        newFilteredProducts = this.originalProducts.filter(product =>
          product.memoryType == filterOption.name
        );
      } else {
        newFilteredProducts = this.originalProducts.filter(product =>
          product.typeNavigation == filterOption.name
        )
      }
      this.filteredProducts = this.filteredProducts.concat(newFilteredProducts);
    }
    this.productsSubject.next(this.filteredProducts);
  }

  filterChipsetType(filterOption: FilterOption) {
    if (this.filteredProducts == undefined) {
      this.filteredProducts = this.originalProducts.filter(product =>
        product.chipsetType == filterOption.name
      );
    } else {
      const newFilteredProducts = this.originalProducts.filter(product =>
        product.chipsetType == filterOption.name
      );
      this.filteredProducts = this.filteredProducts.concat(newFilteredProducts);
    }
    this.productsSubject.next(this.filteredProducts);
  }

  filterDriveType(filterOption: FilterOption) {
    if (this.filteredProducts == undefined) {
      this.filteredProducts = this.originalProducts.filter(product =>
        product.driveType == filterOption.name
      );
    } else {
      const newFilteredProducts = this.originalProducts.filter(product =>
        product.driveType == filterOption.name
      );
      this.filteredProducts = this.filteredProducts.concat(newFilteredProducts);
    }
    this.productsSubject.next(this.filteredProducts);
  }

  updateProducts(products: any[]): void {
    this.productsSubject.next(products);
  }

  updateFilters(newFilters: Filter[]): void {
    this.filtersSubject.next(newFilters);
  }

  resetProducts() {
    this.productsSubject.next(this.originalProducts);
    this.filteredProducts = [];
  }

  async saveProducts(n: number) {
    this.originalProducts = this.productsSubject.getValue();
  }

  getOriginalProducts() {
    return this.originalProducts;
  }
  async chooseProduct(n: number): Promise<void> {
    //n=10;
    this.originalProducts = [];
    var filters = this.filtersSubject.getValue();
    filters = [];
    switch (n) {
      case 0: {
        const products = await firstValueFrom(this.getProcessor());
        this.productsSubject.next(products);
        const manufacturerOptions = getManufacturers(products);
        const seriesOptions = getSeries(products);
        const socketOptions = getSocketTypes(products);
        filters.push({ name: 'Manufacturer', options: manufacturerOptions });
        filters.push({ name: 'Series', options: seriesOptions });
        filters.push({ name: 'Sockets', options: socketOptions });
        break;
      }
      case 1: {
        const products = await firstValueFrom(this.getMotheboard());
        this.productsSubject.next(products);
        const manufacturerOptions = getManufacturers(products);
        const socketOptions = getSocketTypes(products);
        const formFactorOptions = getFormFactorTypes(products);
        const memoryOptions = getMemoryTypes(products);
        filters.push({ name: 'Manufacturer', options: manufacturerOptions });
        filters.push({ name: 'Sockets', options: socketOptions });
        filters.push({ name: 'Form Factors', options: formFactorOptions });
        filters.push({ name: 'Memory Types', options: memoryOptions });
        break;
      }
      case 2: {
        const products = await firstValueFrom(this.getMemory());
        this.productsSubject.next(products);
        const manufacturerOptions = getManufacturers(products);
        const memoryOptions = getMemoryTypes(products);
        filters.push({ name: 'Manufacturer', options: manufacturerOptions });
        filters.push({ name: 'Memory Types', options: memoryOptions });
        break;
      }
      case 3: {
        const products = await firstValueFrom(this.getVideocard());
        this.productsSubject.next(products);
        const manufacturerOptions = getManufacturers(products);
        const seriesOptions = getSeries(products);
        const chipsetOptions = getChipsetTypes(products);
        filters.push({ name: 'Manufacturer', options: manufacturerOptions });
        filters.push({ name: 'Series', options: seriesOptions });
        filters.push({ name: 'Chipsets', options: chipsetOptions });
        break;
      }
      case 4: {
        const products = await firstValueFrom(this.getHarddrive());
        this.productsSubject.next(products);
        const manufacturerOptions = getManufacturers(products);
        filters.push({ name: 'Manufacturer', options: manufacturerOptions });
        break;
      }
      case 5: {
        const products = await firstValueFrom(this.getPowersupply());
        this.productsSubject.next(products);
        const manufacturerOptions = getManufacturers(products);
        const formFactorOptions = getFormFactorTypes(products);
        filters.push({ name: 'Manufacturer', options: manufacturerOptions });
        filters.push({ name: 'Form Factors', options: formFactorOptions });
        break;
      }
      case 6: {
        const products = await firstValueFrom(this.getCase());
        this.productsSubject.next(products);
        const manufacturerOptions = getManufacturers(products);
        const formFactorOptions = getFormFactorTypes(products);
        filters.push({ name: 'Manufacturer', options: manufacturerOptions });
        filters.push({ name: 'Form Factors', options: formFactorOptions });
        break;
      }
      case 7: {
        const products = await firstValueFrom(this.getProcessorCooler());
        this.productsSubject.next(products);
        const manufacturerOptions = getManufacturers(products);
        filters.push({ name: 'Manufacturer', options: manufacturerOptions });
        break;
      }
      default: {
        //this.productsSubject.next(this.mockData);
        break;
      }
    }
    this.updateFilters(filters);
    await this.saveProducts(n);
  }

  getMotheboard(): Observable<Motherboard[]> {
    return this.httpClient.get<any[]>(this.APIUrl + '/Parts/GetMotherboard').pipe(
      map(data => data.map(createMotherboard))
    );
  }

  getProcessor(): Observable<Processor[]> {
    return this.httpClient.get<any[]>(this.APIUrl + '/Parts/GetProcessor').pipe(
      map(data => data.map(createProcessor))
    );
  }

  getVideocard(): Observable<Videocard[]> {
    return this.httpClient.get<any[]>(this.APIUrl + '/Parts/GetVideocard').pipe(
      map(data => data.map(createVideocard))
    );
  }

  getCase(): Observable<Pccase[]> {
    return this.httpClient.get<any[]>(this.APIUrl + '/Parts/GetCase').pipe(
      map(data => data.map(createPccase))
    );
  }

  getMemory(): Observable<Memory[]> {
    return this.httpClient.get<any[]>(this.APIUrl + '/Parts/GetMemory').pipe(
      map(data => data.map(createMemory))
    );
  }

  getHarddrive(): Observable<Harddrive[]> {
    return this.httpClient.get<any[]>(this.APIUrl + '/Parts/GetHarddrive').pipe(
      map(data => data.map(createHarddrive))
    );
  }

  getPowersupply(): Observable<Powersupply[]> {
    return this.httpClient.get<any[]>(this.APIUrl + '/Parts/GetPowersupply').pipe(
      map(data => data.map(createPowersupply))
    );
  }

  getProcessorCooler(): Observable<Cpucooler[]> {
    return this.httpClient.get<any[]>(this.APIUrl + '/Parts/GetProcessorCooler').pipe(
      map(data => data.map(createCpucooler))
    );
  }

  getPart(partId: number, typeName: string): Observable<any> {
    return this.httpClient.get<any>(this.APIUrl + '/parts/getPart' + '?partId=' + partId + '&partType=' + typeName)
  }

  mockData = [
    {
      "processorid": 1,
      "name": "AMD Ryzen 5 5600X",
      "price": 124,
      "socketTypeId": 1,
      "coreCount": 6,
      "coreClock": 4,
      "boostClock": 5,
      "tdp": 65,
      "graphics": null,
      "smt": true,
      "manufacturerTypeId": 1,
      "seriesTypeId": 2,
      "manufacturerType": "AMD",
      "seriesType": "AMD Ryzen 5",
      "socketType": "AM4"
    },
    {
      "processorid": 2,
      "name": "AMD Ryzen 7 5800X",
      "price": 165,
      "socketTypeId": 1,
      "coreCount": 8,
      "coreClock": 4,
      "boostClock": 5,
      "tdp": 105,
      "graphics": null,
      "smt": true,
      "manufacturerTypeId": 1,
      "seriesTypeId": 3,
      "manufacturerType": "AMD",
      "seriesType": "AMD Ryzen 7",
      "socketType": "AM4"
    },
    {
      "processorid": 3,
      "name": "AMD Ryzen 5 5500",
      "price": 80,
      "socketTypeId": 1,
      "coreCount": 6,
      "coreClock": 4,
      "boostClock": 4,
      "tdp": 65,
      "graphics": null,
      "smt": true,
      "manufacturerTypeId": 1,
      "seriesTypeId": 2,
      "manufacturerType": "AMD",
      "seriesType": "AMD Ryzen 5",
      "socketType": "AM4"
    },
    {
      "processorid": 4,
      "name": "AMD Ryzen 5 3600",
      "price": 90,
      "socketTypeId": 1,
      "coreCount": 6,
      "coreClock": 4,
      "boostClock": 4,
      "tdp": 65,
      "graphics": null,
      "smt": true,
      "manufacturerTypeId": 1,
      "seriesTypeId": 2,
      "manufacturerType": "AMD",
      "seriesType": "AMD Ryzen 5",
      "socketType": "AM4"
    },
    {
      "processorid": 5,
      "name": "AMD Ryzen 9 5900X",
      "price": 233,
      "socketTypeId": 1,
      "coreCount": 12,
      "coreClock": 4,
      "boostClock": 5,
      "tdp": 105,
      "graphics": null,
      "smt": true,
      "manufacturerTypeId": 1,
      "seriesTypeId": 4,
      "manufacturerType": "AMD",
      "seriesType": "AMD Ryzen 9",
      "socketType": "AM4"
    },
    {
      "processorid": 6,
      "name": "AMD Ryzen 7 7800X3D",
      "price": 439,
      "socketTypeId": 2,
      "coreCount": 8,
      "coreClock": 4,
      "boostClock": 5,
      "tdp": 120,
      "graphics": "Radeon",
      "smt": true,
      "manufacturerTypeId": 1,
      "seriesTypeId": 3,
      "manufacturerType": "AMD",
      "seriesType": "AMD Ryzen 7",
      "socketType": "AM5"
    },
    {
      "processorid": 7,
      "name": "AMD Ryzen 7 7700X",
      "price": 252,
      "socketTypeId": 2,
      "coreCount": 8,
      "coreClock": 5,
      "boostClock": 5,
      "tdp": 105,
      "graphics": "Radeon",
      "smt": true,
      "manufacturerTypeId": 1,
      "seriesTypeId": 3,
      "manufacturerType": "AMD",
      "seriesType": "AMD Ryzen 7",
      "socketType": "AM5"
    },
    {
      "processorid": 8,
      "name": "AMD Ryzen 5 7600X",
      "price": 195,
      "socketTypeId": 2,
      "coreCount": 6,
      "coreClock": 5,
      "boostClock": 5,
      "tdp": 105,
      "graphics": "Radeon",
      "smt": true,
      "manufacturerTypeId": 1,
      "seriesTypeId": 2,
      "manufacturerType": "AMD",
      "seriesType": "AMD Ryzen 5",
      "socketType": "AM5"
    },
    {
      "processorid": 9,
      "name": "AMD Ryzen 9 7950X3D",
      "price": 546,
      "socketTypeId": 2,
      "coreCount": 16,
      "coreClock": 4,
      "boostClock": 6,
      "tdp": 120,
      "graphics": "Radeon",
      "smt": true,
      "manufacturerTypeId": 1,
      "seriesTypeId": 4,
      "manufacturerType": "AMD",
      "seriesType": "AMD Ryzen 9",
      "socketType": "AM5"
    },
    {
      "processorid": 10,
      "name": "AMD Ryzen 9 9950X",
      "price": 623,
      "socketTypeId": 2,
      "coreCount": 16,
      "coreClock": 4,
      "boostClock": 6,
      "tdp": 170,
      "graphics": "Radeon",
      "smt": true,
      "manufacturerTypeId": 1,
      "seriesTypeId": 4,
      "manufacturerType": "AMD",
      "seriesType": "AMD Ryzen 9",
      "socketType": "AM5"
    },
    {
      "processorid": 11,
      "name": "Intel Core i5-12400F",
      "price": 112,
      "socketTypeId": 4,
      "coreCount": 6,
      "coreClock": 3,
      "boostClock": 4,
      "tdp": 65,
      "graphics": null,
      "smt": true,
      "manufacturerTypeId": 2,
      "seriesTypeId": 6,
      "manufacturerType": "Intel",
      "seriesType": "Intel Core i5",
      "socketType": "LGA1700"
    },
    {
      "processorid": 12,
      "name": "Intel Core i7-14700K",
      "price": 380,
      "socketTypeId": 4,
      "coreCount": 20,
      "coreClock": 3,
      "boostClock": 6,
      "tdp": 125,
      "graphics": "Intel UHD Graphics 770",
      "smt": true,
      "manufacturerTypeId": 2,
      "seriesTypeId": 7,
      "manufacturerType": "Intel",
      "seriesType": "Intel Core i7",
      "socketType": "LGA1700"
    },
    {
      "processorid": 13,
      "name": "Intel Core i9-14900K",
      "price": 529,
      "socketTypeId": 4,
      "coreCount": 24,
      "coreClock": 3,
      "boostClock": 6,
      "tdp": 125,
      "graphics": "Intel UHD Graphics 770",
      "smt": true,
      "manufacturerTypeId": 2,
      "seriesTypeId": 8,
      "manufacturerType": "Intel",
      "seriesType": "Intel Core i9",
      "socketType": "LGA1700"
    },
    {
      "processorid": 14,
      "name": "Intel Core i5-12600K",
      "price": 174,
      "socketTypeId": 4,
      "coreCount": 10,
      "coreClock": 4,
      "boostClock": 5,
      "tdp": 125,
      "graphics": "Intel UHD Graphics 770",
      "smt": true,
      "manufacturerTypeId": 2,
      "seriesTypeId": 6,
      "manufacturerType": "Intel",
      "seriesType": "Intel Core i5",
      "socketType": "LGA1700"
    },
    {
      "processorid": 15,
      "name": "Intel Core i7-13700K",
      "price": 320,
      "socketTypeId": 4,
      "coreCount": 16,
      "coreClock": 3,
      "boostClock": 5,
      "tdp": 125,
      "graphics": "Intel UHD Graphics 770",
      "smt": true,
      "manufacturerTypeId": 2,
      "seriesTypeId": 7,
      "manufacturerType": "Intel",
      "seriesType": "Intel Core i7",
      "socketType": "LGA1700"
    },
    {
      "processorid": 16,
      "name": "Intel Core i5-10400F",
      "price": 99,
      "socketTypeId": 3,
      "coreCount": 6,
      "coreClock": 3,
      "boostClock": 4,
      "tdp": 65,
      "graphics": null,
      "smt": true,
      "manufacturerTypeId": 2,
      "seriesTypeId": 6,
      "manufacturerType": "Intel",
      "seriesType": "Intel Core i5",
      "socketType": "LGA1200"
    },
    {
      "processorid": 17,
      "name": "Intel Core i5-11400F",
      "price": 110,
      "socketTypeId": 3,
      "coreCount": 6,
      "coreClock": 3,
      "boostClock": 4,
      "tdp": 65,
      "graphics": null,
      "smt": true,
      "manufacturerTypeId": 2,
      "seriesTypeId": 6,
      "manufacturerType": "Intel",
      "seriesType": "Intel Core i5",
      "socketType": "LGA1200"
    },
    {
      "processorid": 18,
      "name": "Intel Core i7-10700K",
      "price": 239,
      "socketTypeId": 3,
      "coreCount": 8,
      "coreClock": 4,
      "boostClock": 5,
      "tdp": 125,
      "graphics": "Intel UHD Graphics 630",
      "smt": true,
      "manufacturerTypeId": 2,
      "seriesTypeId": 7,
      "manufacturerType": "Intel",
      "seriesType": "Intel Core i7",
      "socketType": "LGA1200"
    },
    {
      "processorid": 19,
      "name": "Intel Core i3-10100F",
      "price": 69,
      "socketTypeId": 3,
      "coreCount": 4,
      "coreClock": 4,
      "boostClock": 4,
      "tdp": 65,
      "graphics": null,
      "smt": true,
      "manufacturerTypeId": 2,
      "seriesTypeId": 5,
      "manufacturerType": "Intel",
      "seriesType": "Intel Core i3",
      "socketType": "LGA1200"
    },
    {
      "processorid": 20,
      "name": "Intel Core i9-11900K",
      "price": 269,
      "socketTypeId": 3,
      "coreCount": 8,
      "coreClock": 4,
      "boostClock": 5,
      "tdp": 125,
      "graphics": "Intel UHD Graphics 750",
      "smt": true,
      "manufacturerTypeId": 2,
      "seriesTypeId": 8,
      "manufacturerType": "Intel",
      "seriesType": "Intel Core i9",
      "socketType": "LGA1200"
    }
  ]
}

export function filterProductsByName<T extends { name: string }>(
  products$: Observable<T[]>,
  searchTerm: string
): Observable<T[]> {
  return products$.pipe(
    map(products => products.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase())))
  );
}

export function getManufacturers(products: any[]): { name: string; checked: boolean }[] {
  const manufacturers = new Set<string>();

  products.forEach((product) => {
    manufacturers.add(product.manufacturerType!);
  });

  return Array.from(manufacturers).map((manufacturer) => ({
    name: manufacturer,
    checked: false,
  }));
}

export function getSeries(products: any[]): { name: string; checked: boolean }[] {
  const series = new Set<string>();

  products.forEach((product) => {
    series.add(product.seriesType!);
  });

  return Array.from(series).map((series) => ({
    name: series,
    checked: false,
  }));
}

export function getSocketTypes(products: any[]): { name: string; checked: boolean }[] {
  const sockets = new Set<string>();

  products.forEach((product) => {
    sockets.add(product.socketType!);
  });

  return Array.from(sockets).map((series) => ({
    name: series,
    checked: false,
  }));
}

export function getFormFactorTypes(products: any[]): { name: string; checked: boolean }[] {
  const formfactors = new Set<string>();

  products.forEach((product) => {
    if (isMotherboard(product)) {
      formfactors.add(product.formFactoryType!);
    }
    else if (isPSU(product)) {
      formfactors.add(product.formFactor!);
    } else {
      formfactors.add(product.formFactorType!);
    }
  });

  return Array.from(formfactors).map((series) => ({
    name: series,
    checked: false,
  }));
}

export function getMemoryTypes(products: any[]): { name: string; checked: boolean }[] {
  const memorytypes = new Set<string>();

  products.forEach((product) => {
    if (isMotherboard(product)) {
      memorytypes.add(product.memoryType!);
    }
    else {
      memorytypes.add(product.typeNavigation!);
    }
  });

  return Array.from(memorytypes).map((series) => ({
    name: series,
    checked: false,
  }));
}

export function getChipsetTypes(products: any[]): { name: string; checked: boolean }[] {
  const chipsets = new Set<string>();

  products.forEach((product) => {
    chipsets.add(product.chipsetType!);
    //formfactors.add(product.typeNavigation!);
  });

  return Array.from(chipsets).map((series) => ({
    name: series,
    checked: false,
  }));
}

export function getDriveTypes(products: any[]): { name: string; checked: boolean }[] {
  const drivetypes = new Set<string>();

  products.forEach((product) => {
    drivetypes.add(product.driveType!);
    //formfactors.add(product.typeNavigation!);
  });

  return Array.from(drivetypes).map((series) => ({
    name: series,
    checked: false,
  }));
}

export function isMotherboard(item: any): item is Motherboard {
  return "formFactoryType" in item;
}

export function isPSU(item: any): item is Powersupply {
  return "formFactor" in item;
}

export function createProcessor(data: any): Processor {
  return {
    ...data,
    type_name: 'Processor'
  } as Processor;
}

export function createMotherboard(data: any): Motherboard {
  return {
    ...data,
    type_name: 'Motherboard'
  } as Motherboard;
}

export function createCpucooler(data: any): Cpucooler {
  return {
    ...data,
    type_name: 'Cpucooler'
  } as Cpucooler;
}

export function createHarddrive(data: any): Harddrive {
  return {
    ...data,
    type_name: 'Harddrive'
  } as Harddrive;
}

export function createMemory(data: any): Memory {
  return {
    ...data,
    type_name: 'Memory'
  } as Memory;
}

export function createPccase(data: any): Pccase {
  return {
    ...data,
    type_name: 'Pccase'
  } as Pccase;
}

export function createPowersupply(data: any): Powersupply {
  return {
    ...data,
    type_name: 'Powersupply'
  } as Powersupply;
}

export function createVideocard(data: any): Videocard {
  return {
    ...data,
    type_name: 'Videocard'
  } as Videocard;
}