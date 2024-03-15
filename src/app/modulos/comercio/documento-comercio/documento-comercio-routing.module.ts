import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import { AdjuntarFormComponent } from './adjuntar-form/adjuntar-form.component';
import { ListaDocumentoComponent } from './lista-documento/lista-documento.component';


const routes: Routes = [
  {
    path: '',
    component: ListaDocumentoComponent, // tiene que ser list despues
    pathMatch: 'full',
  },
  {
    path: 'adjuntar',
    component: AdjuntarFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentoComercioRoutingModule { }
