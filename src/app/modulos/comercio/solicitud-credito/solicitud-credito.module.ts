import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudCreditoFormComponent } from './solicitud-credito-form/solicitud-credito-form.component';
import { SolicitudCreditoListComponent } from './solicitud-credito-list/solicitud-credito-list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../../material/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {RouterModule} from '@angular/router';
import {SolicitudCreditoRoutingModule} from './solicitud-credito-routing.module';
import {HttpClientModule} from '@angular/common/http';
import {MatCardModule} from '@angular/material/card';
import { SharedComercioModule } from 'app/shared-comercio/shared.module';
import { ListaCompraCreditoModule } from './lista-compra/lista-compra.module';



@NgModule({
  declarations: [
    SolicitudCreditoFormComponent,
    SolicitudCreditoListComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatCardModule,
    RouterModule,
    SharedComercioModule,
    FlexLayoutModule,
    SolicitudCreditoRoutingModule,
    ListaCompraCreditoModule,
  ],
  providers: [
    // ModuloService
  ]
})
export class SolicitudCreditoModule { }
