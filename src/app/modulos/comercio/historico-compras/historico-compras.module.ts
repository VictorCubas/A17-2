import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HistoricoCompraComponent } from './lista-compra/historico-compras.component';
import { HistoricoCompraListComponent } from './historico-compras-list/historico-compras-list.component';
import { HistoricoComprasRoutingModule } from './solicitud-credito-routing.module';
import { CompraUsuarioComponent } from './compra-usuario/compra-usuario.component';
import { AgregarProductoComponent } from './compra-usuario/agregar-producto/agregar-producto.component';
import { DatosCompraComponent } from './datos-compra/datos-compra.component';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/material/material.module';
import { LoaderModule } from 'app/shared-comercio/components/loader/loader.module';
import { SharedComercioModule } from 'app/shared-comercio/shared.module';



@NgModule({
  declarations: [
    HistoricoCompraComponent,
    HistoricoCompraListComponent,
    CompraUsuarioComponent,
    AgregarProductoComponent,
    DatosCompraComponent,
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
    HistoricoComprasRoutingModule,
    LoaderModule,
  ],
  providers: [
    // ModuloService
  ]
})
export class HistoricoComprasModule { }
