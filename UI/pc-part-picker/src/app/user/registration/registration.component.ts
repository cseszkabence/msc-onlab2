import { Component } from '@angular/core';
import { Form, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
@Component({
  selector: 'app-registration',
  standalone: true,
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
  imports: [ReactiveFormsModule, FloatLabelModule, InputTextModule, PasswordModule, ButtonModule]
})
export class RegistrationComponent {
  constructor(public formBuilder: FormBuilder) {}

  form = this.formBuilder.group({
    fullName: [''],
    email: [''],
    password: [''],
    confirmPassword: [''],
  })

  onSubmit(){
    console.log(this.form.value);
  }
}
