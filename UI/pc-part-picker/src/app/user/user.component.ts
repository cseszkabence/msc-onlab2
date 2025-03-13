import { Component } from '@angular/core';
import { RegistrationComponent } from "./registration/registration.component";
import { ButtonModule } from 'primeng/button';
import { DividerModule} from 'primeng/divider'
import { InputTextModule } from 'primeng/inputtext';
 
@Component({
  selector: 'app-user',
  standalone: true,
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  imports: [RegistrationComponent, ButtonModule, DividerModule, InputTextModule]
})
export class UserComponent {

}
