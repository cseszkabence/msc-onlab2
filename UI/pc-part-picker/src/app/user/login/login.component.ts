// src/app/login/login.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';

import { AuthService } from '../../shared/services/auth/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'login-component',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    DividerModule,
    FloatLabelModule,
    InputTextModule,
    PasswordModule,
    ProgressSpinnerModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  isSubmitted = false;
  isLoading = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private msg: MessageService,
    private router: Router
  ) { }

  hasDisplayableError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(
      control &&
      control.invalid &&
      (this.isSubmitted || control.touched || control.dirty)
    );
  }

  onSubmit() {
    this.isSubmitted = true;

    if (this.form.invalid) {
      this.msg.add({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Please fill in all required fields correctly.',
        life: 3000
      });
      return;
    }

    this.isLoading = true;

    const email = this.form.get('email')!.value!;
    const password = this.form.get('password')!.value!;

    this.auth.signin({email, password})
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.msg.add({
            severity: 'success',
            summary: 'Login successful!',
            life: 3000
          });
          // navigate to configurator or returnUrl if you store one
          this.router.navigateByUrl('/configurator-component');
        },
        error: err => {
          if (err.status === 400) {
            this.msg.add({
              severity: 'error',
              summary: 'Login failed!',
              detail: 'Incorrect email or password.',
              life: 3000
            });
          } else {
            console.error('Login error', err);
            this.msg.add({
              severity: 'error',
              summary: 'Login error',
              detail: 'An unexpected error occurred.',
              life: 3000
            });
          }
        }
      });
  }
}
