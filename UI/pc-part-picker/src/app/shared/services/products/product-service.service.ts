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
          product.formFactorType == filterOption.name
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
          product.formFactorType == filterOption.name
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

  async saveProducts() {
    this.originalProducts = this.productsSubject.getValue();
  }

  getOriginalProducts() {
    return this.originalProducts;
  }
  async chooseProduct(n: string): Promise<void> {
    //n=10;
    this.originalProducts = [];
    var filters = this.filtersSubject.getValue();
    filters = [];
    switch (n) {
      case 'processor': {
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
      case 'motherboard': {
        const products = await firstValueFrom(this.getMotherboard());
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
      case 'memory': {
        const products = await firstValueFrom(this.getMemory());
        this.productsSubject.next(products);
        const manufacturerOptions = getManufacturers(products);
        const memoryOptions = getMemoryTypes(products);
        filters.push({ name: 'Manufacturer', options: manufacturerOptions });
        filters.push({ name: 'Memory Types', options: memoryOptions });
        break;
      }
      case 'videocard': {
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
      case 'storage': {
        const products = await firstValueFrom(this.getHarddrive());
        this.productsSubject.next(products);
        const manufacturerOptions = getManufacturers(products);
        filters.push({ name: 'Manufacturer', options: manufacturerOptions });
        break;
      }
      case 'powersupply': {
        const products = await firstValueFrom(this.getPowersupply());
        this.productsSubject.next(products);
        const manufacturerOptions = getManufacturers(products);
        const formFactorOptions = getFormFactorTypes(products);
        filters.push({ name: 'Manufacturer', options: manufacturerOptions });
        filters.push({ name: 'Form Factors', options: formFactorOptions });
        break;
      }
      case 'case': {
        const products = await firstValueFrom(this.getCase());
        this.productsSubject.next(products);
        const manufacturerOptions = getManufacturers(products);
        const formFactorOptions = getFormFactorTypes(products);
        filters.push({ name: 'Manufacturer', options: manufacturerOptions });
        filters.push({ name: 'Form Factors', options: formFactorOptions });
        break;
      }
      case 'cpucooler': {
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
    await this.saveProducts();
  }

  getMotherboard(): Observable<Motherboard[]> {
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

  getPart<T extends PcPart>(partId: number, typeName: string): Observable<T> {
    return this.httpClient.get<T>(this.APIUrl + '/parts/getPart' + '?partId=' + partId + '&partType=' + typeName)
  }

  getImagePath(product: any): string {
    const basePath = '/assets/images/';
    if (product.type_name == 'Videocard') {
      return `${basePath}${product.chipset!}.jpg`;
    }
    else {
      return `${basePath}${product.name!}.jpg`;
    }
  }
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
      formfactors.add(product.formFactorType!);
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
  return "formFactorType" in item;
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