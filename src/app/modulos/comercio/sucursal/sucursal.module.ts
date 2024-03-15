import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../../material/material.module';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../../shared/shared.module';
import {SucursalRoutingModule} from './sucursal-routing.module';
import {SucursalListComponent} from './sucursal-list/sucursal-list.component';
import {SucursalFormComponent} from './sucursal-form/sucursal-form.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SharedComercioModule} from '../../../shared-comercio/shared.module';



@NgModule({
  declarations: [
    SucursalListComponent,
    SucursalFormComponent,
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        FlexLayoutModule,
        RouterModule,
        SharedModule,
        SharedComercioModule,
        SucursalRoutingModule,
    ]
})
export class SucursalModule { }
