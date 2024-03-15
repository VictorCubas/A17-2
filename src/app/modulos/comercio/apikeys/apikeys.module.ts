import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApikeysComponent } from './apikeys-form/apikeys/apikeys.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../../material/material.module';
import {RouterModule} from '@angular/router';
import {SharedComercioModule} from '../../../shared-comercio/shared.module';
import {ApikeysRoutingModule} from './apikeys-routing.module';
import { ClipboardModule } from 'ngx-clipboard';
import {PublickeysComponent} from './apikeys-form/publickeys/publickeys.component';



@NgModule({
  declarations: [
    ApikeysComponent,
    PublickeysComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule,
    SharedComercioModule,
    ApikeysRoutingModule,
    ClipboardModule,
  ],
  providers: [
    //ApikeysService,
  ],
  bootstrap: [ApikeysComponent],
})
export class ApikeysModule { }
