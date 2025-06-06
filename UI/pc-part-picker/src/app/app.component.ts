import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Motherboard } from '../model/Motherboard';
import { filterProductsByName, ProductServiceService } from './shared/services/products/product-service.service';
import { Observable } from 'rxjs';
import { Processor } from '../model/Processor';
import { Router, RouterOutlet } from '@angular/router';
import { Toolbar } from 'primeng/toolbar';
import { Button } from 'primeng/button';
import { NgStyle, NgIf, NgFor } from '@angular/common';
import { InputGroup } from 'primeng/inputgroup';
import { FormsModule } from '@angular/forms';
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from "./user/registration/registration.component";
import { AuthService } from './shared/services/auth/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CartService } from './shared/services/cart/cart.service';
import { MenuComponent } from "./menu/menu.component";

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
    trigger('slideUpDown', [
      state('void', style({ height: '0px', opacity: 0, transform: 'translateY(-100%)' })),
      state('*', style({ height: '*', opacity: 1, transform: 'translateY(0)' })),
      transition('void <=> *', animate('300ms ease-in-out')),
    ])
  ],
  providers: [MessageService],
  imports: [Toolbar, Button, NgStyle, NgIf, InputGroup, FormsModule, NgFor, RouterOutlet, ToastModule, MenuComponent, ToastModule]
})
export class AppComponent {


}
