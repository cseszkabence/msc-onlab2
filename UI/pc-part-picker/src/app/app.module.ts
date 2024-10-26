import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule, routes } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ProductsComponent } from './products/products.component';
import { ConfiguratorComponent } from './configurator/configurator.component';
import { provideRouter } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatExpansionModule} from '@angular/material/expansion';
import { ProductDetailsComponent } from './product-details/product-details.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSliderModule} from '@angular/material/slider';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { SpinnerComponent } from './spinner/spinner.component';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    ConfiguratorComponent,
    ProductDetailsComponent,
    SpinnerComponent,
  ],
  imports: [
    BrowserModule,
    MatButtonToggleModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSliderModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatSidenavModule,
    MatCardModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule
  ],
  providers: [
    provideAnimationsAsync(),
    provideRouter(routes)
  ],
  bootstrap: [AppComponent],
  exports: [MatSliderModule,
  ]
})
export class AppModule { }

