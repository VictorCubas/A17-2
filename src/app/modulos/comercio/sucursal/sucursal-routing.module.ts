import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {SucursalListComponent} from "./sucursal-list/sucursal-list.component";
import {SucursalFormComponent} from "./sucursal-form/sucursal-form.component";


const routes: Routes = [
  {
    path: '',
    component: SucursalListComponent,
    pathMatch: 'full',
  },{
    path: 'registrar',
    component: SucursalFormComponent,
  },
  {
    path: 'modificar',
    component: SucursalFormComponent,
  },
  {
    path: 'ver',
    component: SucursalFormComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SucursalRoutingModule { }
