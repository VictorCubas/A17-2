import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {HistoricoComprasService} from '../historico-compras.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ListaCompra } from 'app/clases/lista-compra';

@Component({
  selector: 'app-historico-compras',
  templateUrl: './historico-compras.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})
export class HistoricoCompraComponent implements OnInit {
  // columnas para la tabla
  displayedColumns = ['codigo', 'descripcion', 'cantidad', 'monto'];

  dataSource: Array<ListaCompra | any> = [];

  constructor(
    private solicitudCreditoService: HistoricoComprasService,
    // @ts-ignore
    @Inject(MAT_DIALOG_DATA) public data,
    private ref: MatDialogRef<HistoricoCompraComponent>,
  ) {
    this.dataSource = data.carrito;
  }

  ngOnInit(): void {
    // if(this.data !== undefined){
    //   this.obtenerListaCompraSolicitud(this.data);
    // }
  }

  /**
   * Funcion para obtener la lista de compra de una solicitud de credito
   */
  obtenerListaCompraSolicitud(idSolicitud: number): any {
    this.solicitudCreditoService.obtenerListaCompra(idSolicitud)
      .subscribe(
        (data: any) => {
          // @ts-ignore
          if (data != null && data['data'] !== undefined) {
            // @ts-ignore
            this.dataSource = data['data'] as any[];
          } else {
            this.dataSource = [];
          }
          //this.snackbar.noMessage();
        });
  }

  /** Gets the total cost of all transactions. */
  getTotalCost(): any {
    return this.dataSource.map(t => t.monto).reduce((acc, value) => acc + value, 0);
  }

  getCantidad(): any {
    let sum = 0;
    this.dataSource.forEach( (e: any) => {
      sum += e.cantidad;
    });
    return sum;
  }

  /**
   * Cierra el modal
   */
  close(): void {
    this.ref.close();
  }

}
