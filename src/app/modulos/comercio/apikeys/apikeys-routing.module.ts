import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApikeysComponent } from './apikeys-form/apikeys/apikeys.component';


const routes: Routes = [
  {
    path: '',
    component: ApikeysComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApikeysRoutingModule { }
