import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguracionComercioComponent } from './configuracion-comercio.component';
import { ConfiguracionComercioRoutingModule } from './configuracion-comercio-routing.module';
import { MaterialModule } from 'app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedComercioModule } from 'app/shared-comercio/shared.module';
import { FuseAlertModule } from '@fuse/components/alert';



@NgModule({
  declarations: [
    ConfiguracionComercioComponent
  ],
  imports: [
    CommonModule,
    ConfiguracionComercioRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComercioModule,
    FuseAlertModule
  ]
})
export class ConfiguracionComercioModule { }
