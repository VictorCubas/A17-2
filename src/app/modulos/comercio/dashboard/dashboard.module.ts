import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'app/material/material.module';
import { ChartVolumenComponent } from './chart-volumen/chart-volumen.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FraccionamientoPlazoComponent } from './fraccionamiento-plazo/fraccionamiento-plazo.component';
import { CantidadSolicitudesMontoComponent } from './cantidad-solicitudes-monto/cantidad-solicitudes-monto.component';
import { CantidadCreditosEstadoComponent } from './cantidad-creditos-estado/cantidad-creditos-estado.component';
import { ListaCompraCreditoModule } from '../solicitud-credito/lista-compra/lista-compra.module';



@NgModule({
  declarations: [
    DashboardComponent,
    ChartVolumenComponent,
    FraccionamientoPlazoComponent,
    CantidadSolicitudesMontoComponent,
    CantidadCreditosEstadoComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgxChartsModule,
    FormsModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    ListaCompraCreditoModule,
  ]
})
export class DashboardModule { }
