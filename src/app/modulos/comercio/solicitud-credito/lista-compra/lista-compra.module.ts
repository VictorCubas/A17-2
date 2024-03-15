import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/material/material.module';
import { ListaCompraComponent } from './lista-compra.component';

@NgModule({
    declarations: [ListaCompraComponent],
    imports: [CommonModule, MaterialModule],
    providers: [],
})
export class ListaCompraCreditoModule {}
