import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioListComponent } from './usuario-list/usuario-list.component';
import { UsuarioFormComponent } from './usuario-form/usuario-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { UsuarioRoutingModule } from './usuario-routing.module';
import { UsuarioRolModule } from '../usuario-rol/usuario-rol.module';
import { SharedComercioModule } from 'app/shared-comercio/shared.module';
import { SharedModule } from 'app/shared/shared.module';


@NgModule({
  declarations: [
    UsuarioListComponent,
    UsuarioFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule,
    SharedModule,
    SharedComercioModule,
    UsuarioRoutingModule,
  ]
})
export class UsuarioModule { }
