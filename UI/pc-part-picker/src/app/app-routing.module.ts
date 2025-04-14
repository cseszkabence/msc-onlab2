import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { ConfiguratorComponent } from './configurator/configurator.component';
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { CartComponent } from './cart/cart.component';
import { NgxStripeModule } from 'ngx-stripe';
import { CheckoutComponent } from './checkout/checkout.component';
import { CheckoutsuccessComponent } from './checkout/checkoutsuccess/checkoutsuccess.component';
import { CheckoutcancelComponent } from './checkout/checkoutcancel/checkoutcancel.component';
import { ProductDetailsComponent } from './product-details/product-details.component';

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
},

{
  path: 'checkout-component',
  component: CheckoutComponent
},

{
  path: 'checkoutsuccess-component',
  component: CheckoutsuccessComponent
},

{
  path: 'checkoutcancel-component',
  component: CheckoutcancelComponent
},

{
  path: 'product-details-component/:id/:type',
  component: ProductDetailsComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes), NgxStripeModule.forRoot('pk_test_51Q2EtTB2B1CUn6npnZe7bRixfPQnqYFUZnSqpu7C3uN7yOuXivIm5g17sx2DSXBNoW54AgGGI8Gr375xJwsTaBz100kdXsqT4p')],
  exports: [RouterModule]
})
export class AppRoutingModule {}
