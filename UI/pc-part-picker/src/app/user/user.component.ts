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

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Component({
  selector: 'app-user',
  standalone: true,
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  imports: [ButtonModule, ProgressSpinnerModule, DividerModule, ToastModule, InputTextModule, CommonModule, ReactiveFormsModule, FloatLabelModule, PasswordModule],
  providers: [MessageService]
})
export class UserComponent {
  constructor(private router: Router, public formBuilder: FormBuilder, private authService: AuthService,private messageService: MessageService
  ) { }

  isSubmitted: boolean = false;
  isLoading: boolean = false;

  form = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  })

  
  
  navigateToRegistration() {
    this.router.navigateByUrl("/registration-component");
  }
  hasDisplayableError(controlName: string): Boolean {
    const control = this.form.get(controlName);
    return Boolean(control?.invalid) && (this.isSubmitted || Boolean(control?.touched) || Boolean(control?.dirty))
  }
  onSubmit(){
    this.isSubmitted = true;
    if(this.form.valid){
      this.isLoading = true;
      this.authService.signin(this.form.value).subscribe({
        next:async (res:any)=>{
          await sleep(3000);
          localStorage.setItem('token',res.token);
          this.authService.setSubject();
          this.messageService.add({ severity: 'success', summary: 'Login successful!', detail: '', life: 3000 });
          this.router.navigateByUrl("/configurator-component").then(()=>this.isLoading=false);
        },
        error: err => {
          if(err.status == 400){
            this.messageService.add({ severity: 'error', summary: 'Login failed!', detail: 'Incorrect email or password!', life: 3000 });
          }
          else
          {
            console.log('error during login:\n',err);
          }
        }
      })
    }
  }

  onLogout(){
    this.authService.onLogout();
  }
}
