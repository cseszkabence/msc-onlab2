import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { ConfiguratorComponent } from './configurator/configurator.component';
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { CartComponent } from './cart/cart.component';

export const routes: Routes = [{
  path: 'products-component',
  component: ProductsComponent
},

{ path: 'configurator-component',
  component: ConfiguratorComponent
},

{ path: 'user-component',
  component: UserComponent
},

{ path: 'registration-component',
  component: RegistrationComponent
},

{
  path: 'cart-component',
  component: CartComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
