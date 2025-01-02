import {enableProdMode, importProvidersFrom} from '@angular/core';

import {environment} from './environments/environment';
import {AppComponent} from './app/app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';
import {HomeComponent} from './app/home.component';
import {provideRouter, Routes} from '@angular/router';
import {provideAnimations} from '@angular/platform-browser/animations';
import {ParticleIconsModule} from './app/shared/modules/icons/particle-icons.module';

const routes: Routes = [
  {path: '', component: HomeComponent}
];

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, FormsModule, ReactiveFormsModule, ParticleIconsModule),
    provideRouter(routes),
    provideAnimations()
  ]
}).catch(err => console.log(err));
