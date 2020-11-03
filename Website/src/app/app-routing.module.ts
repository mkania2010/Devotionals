import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevoDetailComponent } from './devotionals/devo-detail/devo-detail.component';

const routes: Routes = [
  { path: '',
    children: [
      { path: ':id', component: DevoDetailComponent },
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
