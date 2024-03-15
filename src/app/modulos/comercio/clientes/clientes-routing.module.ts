import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {ClientesListComponent} from "./clientes-list/clientes-list.component";


const routes: Routes = [
  {
    path: '',
    component: ClientesListComponent,
    pathMatch: 'full',
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientesRoutingModule { }
