import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComercioRoutingModule } from './comercio-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardModule } from './dashboard/dashboard.module';
import {ApikeysRoutingModule} from './apikeys/apikeys-routing.module';
import { ApidocsComponent } from './apidocs/apidocs.component';
import {SolicitudCreditoRoutingModule} from './solicitud-credito/solicitud-credito-routing.module';
import {RolesRoutingModule} from './roles/roles-list/roles-routing.module';
import {SucursalRoutingModule} from './sucursal/sucursal-routing.module';
import { UsuarioRoutingModule } from './usuario/usuario-routing.module';
@NgModule({
  declarations: [
    ApidocsComponent,
  ],
  imports: [
    CommonModule,
    ComercioRoutingModule,
    DashboardModule,
    ApikeysRoutingModule,
    RolesRoutingModule,
    SolicitudCreditoRoutingModule,
    SucursalRoutingModule,
    UsuarioRoutingModule,
  ]
})
export class ComercioModule { }
