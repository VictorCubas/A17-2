import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ComercioFormComponent } from './comercio-form/comercio-form.component';
import { ComercioListComponent } from './comercio-list/comercio-list.component';


const routes: Routes = [
  {
    path: '',
    component: ComercioListComponent,
    pathMatch: 'full',
  },{
    path: 'registrar',
    component: ComercioFormComponent,
  },
  {
    path: 'modificar',
    component: ComercioFormComponent,
  },
  {
      path: 'ver',
      component: ComercioFormComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrarComercioRoutingModule { }
