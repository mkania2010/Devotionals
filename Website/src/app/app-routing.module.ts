import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevoDetailComponent } from './devotionals/devo-detail/devo-detail.component';
import { DevoListComponent } from './devotionals/devo-list/devo-list.component';

const routes: Routes = [
	// {	path: '', redirectTo: '/2020', pathMatch: 'full'},
	{	path: ':year', component: DevoListComponent,
	children: [
		{ path: ':id', component: DevoDetailComponent },
	]},
	{	path: '**', redirectTo: '/' + ((new Date()).getFullYear()), pathMatch: 'full'}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})

export class AppRoutingModule { }
