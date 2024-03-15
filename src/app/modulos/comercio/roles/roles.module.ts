import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesListComponent } from './roles-list/roles-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/material/material.module';
import { SharedComercioModule } from 'app/shared-comercio/shared.module';
import { RolesRoutingModule } from './roles-list/roles-routing.module';
import { RolesFormComponent } from './roles-form/roles-form.component';

@NgModule({
  declarations: [RolesListComponent, RolesFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    RouterModule,
    SharedComercioModule,
    RolesRoutingModule,
  ],
  providers: [
    // ModuloService
  ]
})
export class RolesModule { }
