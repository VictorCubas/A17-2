import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdjuntarFormComponent } from './adjuntar-form/adjuntar-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'app/material/material.module';
import { DocumentoComercioRoutingModule } from './documento-comercio-routing.module';
import { ListaDocumentoComponent } from './lista-documento/lista-documento.component';
import { SharedComercioModule } from 'app/shared-comercio/shared.module';



@NgModule({
  declarations: [
    AdjuntarFormComponent,
    ListaDocumentoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    DocumentoComercioRoutingModule,
    SharedComercioModule,
  ]
})
export class DocumentoComercioModule { }
