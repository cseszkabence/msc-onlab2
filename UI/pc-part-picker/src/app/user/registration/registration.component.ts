import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, Form, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FirstKeyPipe } from '../../shared/pipes/first-key.pipe';
import { AuthService } from '../../shared/services/auth/auth.service';
import { ToastModule } from 'primeng/toast'
import { MessageService } from 'primeng/api'

@Component({
  selector: 'registration-component',
  standalone: true,
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
  imports: [ReactiveFormsModule, ToastModule, CommonModule, FloatLabelModule, InputTextModule, PasswordModule, ButtonModule, FirstKeyPipe],
  providers: [MessageService]
})
export class RegistrationComponent {
  constructor(
    public formBuilder: FormBuilder,
    private service: AuthService,
    private messageService: MessageService
  ) { }
  isSubmitted: boolean = false;

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): null => {
    const password = control.get('password')
    const confirmPassword = control.get('confirmPassword')
    if (password && confirmPassword && password.value != confirmPassword.value) {
      confirmPassword?.setErrors({ passwordMismatch: true })
    }
    else {
      confirmPassword?.setErrors(null)
    }
    return null;
  }

  form = this.formBuilder.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/(?=.*[^a-zA-Z0-9])/)]],
    confirmPassword: [''],
  }, { validators: this.passwordMatchValidator })



  onSubmit() {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.service.createUser(this.form.value)
        .subscribe({
          next: (res: any) => {
            if (res.succeeded) {
              this.form.reset();
              this.isSubmitted = false;
              this.messageService.add({ severity: 'success', summary: 'Success!', detail: 'Registration successful!', life: 3000 });
            }
          },
          error: err => {
            if (err.error.errors) {
              err.error.errors.forEach((x: any) => {
                switch (x.code) {
                  case "DuplicateUserName":
                    break;
                  case "DuplicateEmail":
                    this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'This email address is already registered!', life: 3000 });
                    break;
                  default:
                    this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Unknown error!', life: 3000 });
                    console.log(x);
                    break;
                }
              });
            }
            else {
              console.log('error', err)
            }
          }
        })
    }
  }


  hasDisplayableError(controlName: string): Boolean {
    const control = this.form.get(controlName);
    return Boolean(control?.invalid) && (this.isSubmitted || Boolean(control?.touched))
  }
}
