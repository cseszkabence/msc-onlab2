import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { AppRoutingModule, routes } from './app-routing.module';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { MatListModule } from '@angular/material/list';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
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

export const appConfig: ApplicationConfig = {
    providers: [
        importProvidersFrom(BrowserModule,
          AppRoutingModule,
          FormsModule,
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
          ScrollTopModule
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
        provideHttpClient(withInterceptorsFromDi())
      ]
  };