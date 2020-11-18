import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevoDetailComponent } from './devotionals/devo-detail/devo-detail.component';
import { DevoListComponent } from './devotionals/devo-list/devo-list.component';

const routes: Routes = [
	// Main path with year and child of the devo's ID
	{	path: ':year', component: DevoListComponent,
	children: [
		{ path: ':id', component: DevoDetailComponent },
	]},
	// Wildcard route to redirect to the current year
	{	path: '**', redirectTo: '/' + ((new Date()).getFullYear()), pathMatch: 'full'}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})

export class AppRoutingModule { }
