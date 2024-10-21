import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Motherboard } from '../model/Motherboard';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Processor } from '../model/Processor';
import { Videocard } from '../model/Videocard';
import { Pccase } from '../model/Pccase';
import { Memory } from '../model/Memory';
import { Harddrive } from '../model/Harddrive';
import { Powersupply } from '../model/Powersupply';
import { Cpucooler } from '../model/Cpucooler';


@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {
  private APIUrl = "http://localhost:5147/api"
  productsSubject = new BehaviorSubject<any[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor(
    private httpClient:HttpClient
  ) { }

  searchProducts(searchQuery: string): void {
    const currentProducts = this.productsSubject.getValue(); // Get the current value of the products array
    const filteredProducts = currentProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    this.productsSubject.next(filteredProducts); // Update the BehaviorSubject with the filtered array
  }

  updateProducts(products: any[]): void {
    this.productsSubject.next(products);
  }

  getProducts() {
    return this.products$;
  }

  chooseProduct(n: number): void {
    switch(n){
      case 0: {
        this.getProcessor().subscribe({
          next: (products) => this.productsSubject.next(products),
          error: (err) => console.error('Failed to load products', err)
        });
        break;
      }
      case 1: { 
        this.getMotheboard().subscribe({
          next: (products) => this.productsSubject.next(products),
          error: (err) => console.error('Failed to load products', err)
        }); 
        break;
      }
      case 2: {
        this.getMemory().subscribe({
          next: (products) => this.productsSubject.next(products),
          error: (err) => console.error('Failed to load products', err)
        });         
        break;
      }
      case 3: {
        this.getVideocard().subscribe({
          next: (products) => this.productsSubject.next(products),
          error: (err) => console.error('Failed to load products', err)
        });         
        break;
      }
      case 4: {
        this.getHarddrive().subscribe({
          next: (products) => this.productsSubject.next(products),
          error: (err) => console.error('Failed to load products', err)
        });        
        break;
      }
      case 5: {
        this.getPowersupply().subscribe({
          next: (products) => this.productsSubject.next(products),
          error: (err) => console.error('Failed to load products', err)
        });         
        break;
      }
      case 6: {
        this.getCase().subscribe({
          next: (products) => this.productsSubject.next(products),
          error: (err) => console.error('Failed to load products', err)
        });         
        break;
      }
      case 7: {
        this.getProcessorCooler().subscribe({
          next: (products) => this.productsSubject.next(products),
          error: (err) => console.error('Failed to load products', err)
        });         
        break;
      }
      default:{
        //this.productsSubject.next(this.mockData);
        break;
      }
    }
  }

  getMotheboard(): Observable<Motherboard[]>
  {
    return this.httpClient.get<Motherboard[]>(this.APIUrl + '/Parts/GetMotherboard')
  }

  getProcessor(): Observable<Processor[]>
  {
    return this.httpClient.get<Processor[]>(this.APIUrl + '/Parts/GetProcessor')
  }

  getVideocard(): Observable<Videocard[]>
  {
    return this.httpClient.get<Videocard[]>(this.APIUrl + '/Parts/GetVideocard')
  }

  getCase(): Observable<Pccase[]>
  {
    return this.httpClient.get<Pccase[]>(this.APIUrl + '/Parts/GetCase')
  }

  getMemory(): Observable<Memory[]>
  {
    return this.httpClient.get<Memory[]>(this.APIUrl + '/Parts/GetMemory')
  }

  getHarddrive(): Observable<Harddrive[]>
  {
    return this.httpClient.get<Harddrive[]>(this.APIUrl + '/Parts/GetHarddrive')
  }

  getPowersupply(): Observable<Powersupply[]>
  {
    return this.httpClient.get<Powersupply[]>(this.APIUrl + '/Parts/GetPowersupply')
  }

  getProcessorCooler(): Observable<Cpucooler[]>
  {
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
      "manufacturerType": null,
      "seriesType": null,
      "socketType": null
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
      "manufacturerType": null,
      "seriesType": null,
      "socketType": null
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
      "manufacturerType": null,
      "seriesType": null,
      "socketType": null
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
      "manufacturerType": null,
      "seriesType": null,
      "socketType": null
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
      "manufacturerType": null,
      "seriesType": null,
      "socketType": null
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
      "manufacturerType": null,
      "seriesType": null,
      "socketType": null
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
      "manufacturerType": null,
      "seriesType": null,
      "socketType": null
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
      "manufacturerType": null,
      "seriesType": null,
      "socketType": null
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
      "manufacturerType": null,
      "seriesType": null,
      "socketType": null
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
      "manufacturerType": null,
      "seriesType": null,
      "socketType": null
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
      "manufacturerType": null,
      "seriesType": null,
      "socketType": null
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
      "manufacturerType": null,
      "seriesType": null,
      "socketType": null
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
      "manufacturerType": null,
      "seriesType": null,
      "socketType": null
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
      "manufacturerType": null,
      "seriesType": null,
      "socketType": null
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
      "manufacturerType": null,
      "seriesType": null,
      "socketType": null
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
      "manufacturerType": null,
      "seriesType": null,
      "socketType": null
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
      "manufacturerType": null,
      "seriesType": null,
      "socketType": null
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
      "manufacturerType": null,
      "seriesType": null,
      "socketType": null
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
      "manufacturerType": null,
      "seriesType": null,
      "socketType": null
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
      "manufacturerType": null,
      "seriesType": null,
      "socketType": null
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

