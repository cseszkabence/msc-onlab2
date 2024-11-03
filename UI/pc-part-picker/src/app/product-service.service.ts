import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Motherboard } from '../model/Motherboard';
import { BehaviorSubject, filter, firstValueFrom, map, Observable } from 'rxjs';
import { getManufacturers, getSeries, Processor } from '../model/Processor';
import { Videocard } from '../model/Videocard';
import { Pccase } from '../model/Pccase';
import { Memory } from '../model/Memory';
import { Harddrive } from '../model/Harddrive';
import { Powersupply } from '../model/Powersupply';
import { Cpucooler } from '../model/Cpucooler';

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
  productsSubject = new BehaviorSubject<any[]>([]);
  products$ = this.productsSubject.asObservable();

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
    this.productsSubject.next(filteredProducts); // Update the BehaviorSubject with the filtered array
  }

  filterManufacturers(filterOption: FilterOption){
    const filteredProducts = this.originalProducts.filter(product =>
      product.manufacturerType == filterOption.name
    );
    this.productsSubject.next(filteredProducts);
  }

  filterSeries(filterOption: FilterOption){
    //const currentProducts = this.productsSubject.getValue();
    if(this.filteredProducts == undefined){
      this.filteredProducts = this.originalProducts.filter(product =>
        product.seriesType == filterOption.name
      );
    }else{
      const newFilteredProducts = this.originalProducts.filter(product =>
        product.seriesType == filterOption.name
      );
      //this.filteredProducts.push(newFilteredProducts);
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

  resetProducts(){
    this.productsSubject.next(this.originalProducts);
    this.filteredProducts = [];
  }

  async saveProducts() {
    this.originalProducts = this.productsSubject.getValue();
    this.addManufacturerFilter(this.originalProducts)
  }

  getOriginalProducts() {
    return this.originalProducts;
  }

  addManufacturerFilter(products: Processor[]) {
    const manufacturerOptions = getManufacturers(products); // Convert products to filter options
    const seriesOptions = getSeries(products);
    var filters = this.filtersSubject.getValue();
    filters = [];
    filters.push({ name: 'Manufacturer', options: manufacturerOptions });
    filters.push({ name: 'Series', options: seriesOptions });
    this.updateFilters(filters);
  }

  async chooseProduct(n: number): Promise<void> {
    n=10;
    this.originalProducts = [];
    switch (n) {
      case 0: {
        const products = await firstValueFrom(this.getProcessor());
        this.productsSubject.next(products);
        break;
      }
      case 1: {
        const products = await firstValueFrom(this.getMotheboard());
        this.productsSubject.next(products);
        break;
      }
      case 2: {
        const products = await firstValueFrom(this.getMemory());
        this.productsSubject.next(products);
        break;
      }
      case 3: {
        const products = await firstValueFrom(this.getVideocard());
        this.productsSubject.next(products);
        break;
      }
      case 4: {
        const products = await firstValueFrom(this.getHarddrive());
        this.productsSubject.next(products);
        break;
      }
      case 5: {
        const products = await firstValueFrom(this.getPowersupply());
        this.productsSubject.next(products);
        break;
      }
      case 6: {
        const products = await firstValueFrom(this.getCase());
        this.productsSubject.next(products);
        break;
      }
      case 7: {
        const products = await firstValueFrom(this.getProcessorCooler());
        this.productsSubject.next(products);
        break;
      }
      default: {
        this.productsSubject.next(this.mockData);
        break;
      }
    }
    await this.saveProducts();
  }

  getMotheboard(): Observable<Motherboard[]> {
    return this.httpClient.get<Motherboard[]>(this.APIUrl + '/Parts/GetMotherboard')
  }

  getProcessor(): Observable<Processor[]> {
    return this.httpClient.get<Processor[]>(this.APIUrl + '/Parts/GetProcessor')
  }

  getVideocard(): Observable<Videocard[]> {
    return this.httpClient.get<Videocard[]>(this.APIUrl + '/Parts/GetVideocard')
  }

  getCase(): Observable<Pccase[]> {
    return this.httpClient.get<Pccase[]>(this.APIUrl + '/Parts/GetCase')
  }

  getMemory(): Observable<Memory[]> {
    return this.httpClient.get<Memory[]>(this.APIUrl + '/Parts/GetMemory')
  }

  getHarddrive(): Observable<Harddrive[]> {
    return this.httpClient.get<Harddrive[]>(this.APIUrl + '/Parts/GetHarddrive')
  }

  getPowersupply(): Observable<Powersupply[]> {
    return this.httpClient.get<Powersupply[]>(this.APIUrl + '/Parts/GetPowersupply')
  }

  getProcessorCooler(): Observable<Cpucooler[]> {
    return this.httpClient.get<Cpucooler[]>(this.APIUrl + '/Parts/GetProcessorCooler')
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

