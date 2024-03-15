import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ClientesListComponent} from './clientes-list/clientes-list.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../../material/material.module';
import {MatCardModule} from '@angular/material/card';
import {RouterModule} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ClientesRoutingModule} from './clientes-routing.module';
import { SharedComercioModule } from 'app/shared-comercio/shared.module';



@NgModule({
  declarations: [
    ClientesListComponent,
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
    ClientesRoutingModule,
  ],
  providers: [
    // ModuloService
  ]
})
export class ClientesModule { }
