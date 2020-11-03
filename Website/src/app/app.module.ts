import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { DevotionalsComponent } from './devotionals/devotionals.component';
import { DevoDetailComponent } from './devotionals/devo-detail/devo-detail.component';
import { DevoListComponent } from './devotionals/devo-list/devo-list.component';
import { DevoItemComponent } from './devotionals/devo-list/devo-item/devo-item.component';

@NgModule({
  declarations: [
    AppComponent,
    DevotionalsComponent,
    NavMenuComponent,
    DevoDetailComponent,
    DevoListComponent,
    DevoItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }