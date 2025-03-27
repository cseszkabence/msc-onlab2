import { Component } from '@angular/core';
import { RegistrationComponent } from "./registration/registration.component";
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider'
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AuthService } from '../shared/services/auth/auth.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api'
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { waitForAsync } from '@angular/core/testing';
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-user',
  standalone: true,
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  imports: [ButtonModule, ProgressSpinnerModule, DividerModule, ToastModule, InputTextModule, CommonModule, ReactiveFormsModule, FloatLabelModule, PasswordModule, LoginComponent, RegistrationComponent],
  providers: [MessageService]
})
export class UserComponent {
  constructor(private router: Router, public formBuilder: FormBuilder, private authService: AuthService,private messageService: MessageService
  ) { }

  
  
  navigateToRegistration() {
    this.router.navigateByUrl("/registration-component");
  }
  

  onLogout(){
    this.authService.onLogout();
  }
}
