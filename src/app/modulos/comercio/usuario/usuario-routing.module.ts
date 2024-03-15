import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioFormComponent } from './usuario-form/usuario-form.component';
import { UsuarioListComponent } from './usuario-list/usuario-list.component';

const routes: Routes = [
  {
    path: '',
    component: UsuarioListComponent,
    pathMatch: 'full',
  },{
    path: 'registrar',
    component: UsuarioFormComponent,
  },
  {
    path: 'modificar',
    component: UsuarioFormComponent,
  },
  {
    path: 'ver',
    component: UsuarioFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuarioRoutingModule {}
