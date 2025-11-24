import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { AppRoutingModule, routes } from './app-routing.module';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { withInterceptorsFromDi, provideHttpClient, HttpClient } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { MegaMenuModule } from 'primeng/megamenu';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { AvatarModule } from 'primeng/avatar';
import { ToolbarModule } from 'primeng/toolbar';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ListboxModule } from 'primeng/listbox';
import { TableModule } from 'primeng/table';
import { SplitterModule } from 'primeng/splitter';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { importProvidersFrom } from '@angular/core';
import { MyPreset } from './mytheme/mytheme';
import { TagModule } from 'primeng/tag';
import { DataViewModule } from 'primeng/dataview';
import { ScrollTopModule } from 'primeng/scrolltop';
import { ToastModule } from 'primeng/toast';
import { LoginComponent } from './user/login/login.component';
import { provideNgxStripe } from 'ngx-stripe';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule,
      AppRoutingModule,
      FormsModule,
      HttpClient,
      ButtonModule,
      MegaMenuModule,
      AvatarGroupModule,
      AvatarModule,
      ToolbarModule,
      InputGroupModule,
      InputGroupAddonModule,
      ListboxModule,
      TableModule,
      SplitterModule,
      AccordionModule,
      CardModule,
      CheckboxModule,
      DataViewModule,
      TagModule,
      ScrollTopModule,
      ToastModule,
      DialogModule
    ),
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: false
        }
      }
    }),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    provideNgxStripe()
  ]
};