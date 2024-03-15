import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SolicitudCreditoListComponent} from './solicitud-credito-list/solicitud-credito-list.component';
import {SolicitudCreditoFormComponent} from './solicitud-credito-form/solicitud-credito-form.component';


const routes: Routes = [
  {
    path: '',
    component: SolicitudCreditoListComponent,
    pathMatch: 'full',
  },
  {
    path: 'ver',
    component: SolicitudCreditoFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitudCreditoRoutingModule { }
