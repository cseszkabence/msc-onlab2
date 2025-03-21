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

@Component({
  selector: 'app-user',
  standalone: true,
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  imports: [RegistrationComponent, ButtonModule, DividerModule, ToastModule, InputTextModule, CommonModule, ReactiveFormsModule, FloatLabelModule, PasswordModule],
  providers: [MessageService]
})
export class UserComponent {
  constructor(private router: Router, public formBuilder: FormBuilder, private service: AuthService,private messageService: MessageService
  ) { }

  isSubmitted: boolean = false;

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
      this.service.signin(this.form.value).subscribe({
        next:(res:any)=>{
          this.messageService.add({ severity: 'success', summary: 'Login successful!', detail: '', life: 3000 });
          this.router.navigateByUrl("/configurator-component");
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
    localStorage.removeItem('token');
    this.messageService.add({ severity: 'success', summary: 'Logout successful!', detail: '', life: 3000 });
  }
}
