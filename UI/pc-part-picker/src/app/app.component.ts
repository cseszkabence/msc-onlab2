import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Motherboard } from '../model/Motherboard';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    trigger('slideDownUp', [
      state('void', style({ height: '0px', opacity: 0 })),
      state('*', style({ height: '*', opacity: 1 })),
      transition('void <=> *', animate('300ms ease-in-out')),
    ]),
  ],
})
export class AppComponent {


  title = 'PC PART PICKER';
  private APIUrl = "http://localhost:5147/api"
  constructor(
    private httpClient:HttpClient
  ){}

  showSearchBar: boolean = false;
  showProductsBar: boolean = false;

  cards = [
    { title: 'Processor', content: ' ' },
    { title: 'Motherboard', content: ' ' },
    { title: 'Memory', content: ' ' },
    { title: 'Videocard', content: ' ' },
    { title: 'Storage', content: ' ' },
    { title: 'Powersupply', content: ' ' },
    { title: 'Case', content: ' ' },
    { title: 'Processor cooler', content: ' ' },
  ];

  electronicsFilters = [
    { name: 'Manufacturer', options: [{ name: 'Brand A', checked: false }, { name: 'Brand B', checked: false }] },
    { name: 'Price', options: [{ name: 'Under $500', checked: false }, { name: '$500 - $1000', checked: false }] }
  ];
  // Example filters and products for clothing
  clothingFilters = [
    { name: 'Size', options: [{ name: 'Small', checked: false }, { name: 'Medium', checked: false }, { name: 'Large', checked: false }] },
    { name: 'Color', options: [{ name: 'Red', checked: false }, { name: 'Blue', checked: false }] }
  ];

  currentProducts: any=[];

  searchQuery: string = '';
  VideocardModel:any=[];
  MotherboardModel:any=[];
  ProcessorModel:any=[];
  MemoryModel:any=[];
  CaseModel:any=[];
  HarddriveModel:any=[];
  PowersupplyModel:any=[];
  ProcessorCoolerModel:any=[];

  toggleSearch(): void {
    //this.showProductsBar = false;

    this.showSearchBar = !this.showSearchBar;
  }

  toggleProducts(): void {
    this.showSearchBar = false;

    this.showProductsBar = !this.showProductsBar;
  }

  getMotheboard()
  {
    this.httpClient.get<Motherboard[]>(this.APIUrl + '/Parts/GetMotherboard').subscribe(data=>{
      this.MotherboardModel=data
    })
  }

  async getProcessor()
  {
    this.httpClient.get(this.APIUrl + '/Parts/GetProcessor').subscribe(data=>{
      this.ProcessorModel=data
    })
  }

  async getVideocard()
  {
    this.httpClient.get(this.APIUrl + '/Parts/GetVideocard').subscribe(data=>{
      this.VideocardModel=data
    })
  }

  async getCase()
  {
    this.httpClient.get(this.APIUrl + '/Parts/GetCase').subscribe(data=>{
      this.CaseModel=data
    })
  }

  async getMemory()
  {
    this.httpClient.get(this.APIUrl + '/Parts/GetMemory').subscribe(data=>{
      this.MemoryModel=data
    })
  }

  async getHarddrive()
  {
    this.httpClient.get(this.APIUrl + '/Parts/GetHarddrive').subscribe(data=>{
      this.HarddriveModel=data
    })
  }

  async getPowersupply()
  {
    this.httpClient.get(this.APIUrl + '/Parts/GetPowersupply').subscribe(data=>{
      this.PowersupplyModel=data
    })
  }

  async getProcessorCooler()
  {
    this.httpClient.get(this.APIUrl + '/Parts/GetProcessorCooler').subscribe(data=>{
      this.ProcessorCoolerModel=data
    })
  }
  
  ngOnInit() 
  {
/*     this.getVideocard()
    this.getCase()
    this.getHarddrive()
    this.getMemory()
    this.getMotheboard()
    this.getPowersupply()
    this.getProcessor()
    this.getProcessorCooler() */
  }

  async chooseProduct(n: number) {
    switch(n){
      case 0: {
        await this.getProcessor();
        this.currentProducts = this.ProcessorModel;
        break;
      }
      case 1: {
        await this.getMotheboard();
        this.currentProducts = this.MotherboardModel;
        break;
      }
      case 2: {
        await this.getMemory();
        this.currentProducts = this.MemoryModel;
        break;
      }
      case 3: {
        await this.getVideocard();
        this.currentProducts = this.VideocardModel;
        break;
      }
      case 4: {
        await this.getHarddrive();
        this.currentProducts = this.HarddriveModel;
        break;
      }
      case 5: {
        await this.getPowersupply();
        this.currentProducts = this.PowersupplyModel;
        break;
      }
      case 6: {
        await this.getCase();
        this.currentProducts = this.CaseModel;
        break;
      }
      case 7: {
        await this.getProcessorCooler();
        this.currentProducts = this.ProcessorCoolerModel;
        break;
      }
      default:{
        break;
      }
    }
  }
}
