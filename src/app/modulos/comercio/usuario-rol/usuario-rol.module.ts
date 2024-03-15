import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/material/material.module';
import { SharedComercioModule } from 'app/shared-comercio/shared.module';
import { UsuarioRolRoutingModule } from './usuario-rol-routing.module';
import { UsuarioRolListComponent } from './usuario-rol-list/usuario-rol-list.component';

@NgModule({
  declarations: [UsuarioRolListComponent],
  exports: [UsuarioRolListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    RouterModule,
    SharedComercioModule,
    UsuarioRolRoutingModule,
  ],
  // providers: [ModuloService],
})
export class UsuarioRolModule {}
