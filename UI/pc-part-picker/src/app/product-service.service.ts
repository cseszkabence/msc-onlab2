import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Motherboard } from '../model/Motherboard';
import { BehaviorSubject, Observable } from 'rxjs';
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
  private productsSubject = new BehaviorSubject<any[]>([]);
  products$: Observable<any[]> = this.productsSubject.asObservable();
  private filters: { [key: string]: any } = {};

  constructor(
    private httpClient:HttpClient
  ) { }
  

  // Method to set filter criteria and update the product list
  setFilter(key: string, value: any): void {
    this.filters[key] = value;  // Add or update the filter
    const currentProducts = this.productsSubject.getValue();
    const filteredProducts = this.applyFilters(currentProducts);
    this.productsSubject.next(filteredProducts);  // Emit the filtered products
  }

  // Apply filters to the current list of products
  private applyFilters(products: any[]): any[] {
    return products.filter(product => {
      // Example filter logic, can be expanded
      return Object.keys(this.filters).every(filterKey => {
        switch (filterKey) {
          case 'brand':
            return product.brand === this.filters[filterKey];
          case 'priceRange':
            return product.price >= this.filters[filterKey][0] && product.price <= this.filters[filterKey][1];
          default:
            return true;
        }
      });
    });
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
}
