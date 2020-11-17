import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { NavMenuComponent } from './nav-menu/nav-menu.component';

import { DevoDetailComponent } from './devotionals/devo-detail/devo-detail.component';
import { DevoListComponent } from './devotionals/devo-list/devo-list.component';
import { DevoItemComponent } from './devotionals/devo-list/devo-item/devo-item.component';
import { DevotionalFilterPipe } from './devotionals/devotional-filter.pipe';

@NgModule({
	declarations: [
		AppComponent,
		NavMenuComponent,
		DevoDetailComponent,
		DevoListComponent,
		DevoItemComponent,
		DevotionalFilterPipe
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		FormsModule,
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }