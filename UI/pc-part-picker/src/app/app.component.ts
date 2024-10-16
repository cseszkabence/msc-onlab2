import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { trigger, state, style, transition, animate } from '@angular/animations';


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
    { name: 'Brand', options: [{ name: 'Brand A', checked: false }, { name: 'Brand B', checked: false }] },
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
    this.showProductsBar = false;

    this.showSearchBar = !this.showSearchBar;
  }

  toggleProducts(): void {
    this.showSearchBar = false;

    this.showProductsBar = !this.showProductsBar;
  }

  getMotheboard()
  {
    this.httpClient.get(this.APIUrl + '/Parts/GetMotherboard').subscribe(data=>{
      this.MotherboardModel=data
    })
  }

  getProcessor()
  {
    this.httpClient.get(this.APIUrl + '/Parts/GetProcessor').subscribe(data=>{
      this.ProcessorModel=data
    })
  }

  getVideocard()
  {
    this.httpClient.get(this.APIUrl + '/Parts/GetVideocard').subscribe(data=>{
      this.VideocardModel=data
    })
  }

  getCase()
  {
    this.httpClient.get(this.APIUrl + '/Parts/GetCase').subscribe(data=>{
      this.CaseModel=data
    })
  }

  getMemory()
  {
    this.httpClient.get(this.APIUrl + '/Parts/GetMemory').subscribe(data=>{
      this.MemoryModel=data
    })
  }

  getHarddrive()
  {
    this.httpClient.get(this.APIUrl + '/Parts/GetHarddrive').subscribe(data=>{
      this.HarddriveModel=data
    })
  }

  getPowersupply()
  {
    this.httpClient.get(this.APIUrl + '/Parts/GetPowersupply').subscribe(data=>{
      this.PowersupplyModel=data
    })
  }

  getProcessorCooler()
  {
    this.httpClient.get(this.APIUrl + '/Parts/GetProcessorCooler').subscribe(data=>{
      this.ProcessorCoolerModel=data
    })
  }
  
  ngOnInit() 
  {
    this.getVideocard()
    this.getCase()
    this.getHarddrive()
    this.getMemory()
    this.getMotheboard()
    this.getPowersupply()
    this.getProcessor()
    this.getProcessorCooler()
  }

  chooseProduct(n: number) {
    switch(n){
      case 0: {
        this.currentProducts = this.ProcessorModel;
        break;
      }
      case 1: {
        this.currentProducts = this.MotherboardModel;
        break;
      }
      case 2: {
        this.currentProducts = this.MemoryModel;
        break;
      }
      case 3: {
        this.currentProducts = this.VideocardModel;
        break;
      }
      case 4: {
        this.currentProducts = this.HarddriveModel;
        break;
      }
      case 5: {
        this.currentProducts = this.PowersupplyModel;
        break;
      }
      case 6: {
        this.currentProducts = this.CaseModel;
        break;
      }
      case 7: {
        this.currentProducts = this.ProcessorCoolerModel;
        break;
      }
      default:{
        break;
      }
    }
  }
}
