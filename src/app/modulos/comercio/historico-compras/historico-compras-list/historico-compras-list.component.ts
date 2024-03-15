/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { CompraUsuario } from 'app/clases/compra-usuario';
import { SnackbarService } from 'app/services/snackbar-service.service';
import { PageHeaderData } from 'app/shared-comercio/components/forms-header/page-header-data';
import { PageHeaderDataService } from 'app/shared-comercio/services/page-header-data.service';
import { DatosCompraComponent } from '../datos-compra/datos-compra.component';
import { HistoricoComprasService } from '../historico-compras.service';
import { HistoricoCompraComponent } from '../lista-compra/historico-compras.component';


@Component({
  selector: 'app-historico-compras-list',
  templateUrl: './historico-compras-list.component.html',
  styleUrls: []
})
export class HistoricoCompraListComponent implements OnInit {
  // columnas para la tabla
  displayedColumns = ['fechaHora', 'cliente', 'importe', 'estadoSolicitud','mensajeCliente', 'acciones'];

  filtroDateKeys = {
    fechaSolicitud: true,
  };

  filtroSelectKeys = {
    estadoSolicitudId: true,
    franquiciaId: true,
  };

  dataSource: Array<CompraUsuario> = [];
  paginacion: any;
  panelOpenState = false;
  filter: any = {

    // filtros
    nombre: '',
    username: '',
    codigoCliente: '',
    franquiciaId: null,
    fechaSolicitud: '',
    estadoSolicitudId: null,

    // paginado
    pagina: 1,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    cantidad_pagina: 10
  };
  //form: FormGroup
  estadoList: any[] = [];
  franquiciaList: any[] = [];
  filterTimer: any;

  size = 0;
  pagina = 0;

  constructor(
    private headerDataService: PageHeaderDataService,
    public fb: FormBuilder,
    private solicitudCreditoService: HistoricoComprasService,
    private snackbar: SnackbarService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.paginacion = {};
    this.obtenerListaEstadoSolicitudCredito();
    this.obtenerListaSolicitudCredito(1);
    this.headerDataService.setHeaderData(new PageHeaderData('Ventas realizadas', 'comercio/ventas/nueva-venta', false, true));
  }


  obtenerDatos(event?: PageEvent | any): any {
    let pagina = 1;
    pagina = event.pageIndex + 1;

    if (event.pageIndex === 0 && event.previousPageIndex === 1) {
      pagina = 1;
    }
    this.size = event.pageSize;
    this.pagina = pagina;
    this.obtenerListaSolicitudCredito(pagina);
    return event;
  }

  /**
   * Agrega los valores al filtro y realiza una carga de los datos de la tabla
   *
   * @param key clave de filtro
   * @param value valor del filtro
   */
  buscarCampo(key: string, value: string | number): any {


    // si es filtro tipo date
   /* if (this.filtroDateKeys[key]) {
      const date = new Date(value);
      value = date.getFullYear() + (date.getMonth() < 9 ? '-0' : '-') + (date.getMonth()+1) + (date.getDate() < 10 ? '-0' : '-')  + date.getDate();
    }*/

    this.filter[key] = value;

    // si es filtro selector
    // @ts-ignore
    if (this.filtroSelectKeys[key]) {
      if (value === -1) {
        this.filter[key] = null;
      }
    }

    clearTimeout(this.filterTimer);
    this.filterTimer = setTimeout(() => {
      this.obtenerListaSolicitudCredito(1);
      clearTimeout(this.filterTimer);
    }, 500);
  }


  /**
   * Funcion para obtener la lista de solicitudes de credito existentes
   */
  obtenerListaSolicitudCredito(page: number): any {
    this.filter.pagina = page;
    this.filter.cantidadPagina = 10;
    this.solicitudCreditoService.obtenerListaSolicitudCredito(this.filter)
      .subscribe(
        (data: any) => {
          // @ts-ignore
          if (data != null && data['data'] !== undefined) {
            // @ts-ignore
            this.dataSource = data['data'] as any[];
            // @ts-ignore
            this.paginacion = data['pagination'];
          } else {
            this.dataSource = [];
            this.paginacion = {
              actual: 1,
              cantidad: 0,
              por_pagina: 10,
              total: 0
            };
          }
          this.snackbar.noMessage();
        });
  }

  /**
   * Funcion para obtener la lista de estados de solicitudes de crédito existentes
   */
  obtenerListaEstadoSolicitudCredito(): any {
    this.solicitudCreditoService.obtenerListaEstaddoSolicitudCredito()
      .subscribe(
        (data: any) => {
          // @ts-ignore
          if (data != null && data['data'] !== undefined) {
            // @ts-ignore
            this.estadoList = [...[{id: -1, nombre: 'TODOS'}], ...data['data']];
          } else {
            this.estadoList = [];
          }
          //this.snackbar.noMessage();
        });
  }

  /**
   * Limpia campos de fehca
   *
   * @param campo nombre del filtro a limpiar
   * @param $event componente a limpiar en el html
   */
  clearDate(campo: string, $event: MatDatepicker<any>): any {
    this.filter[campo] = '';
  }

  openDialog(e: CompraUsuario): void  {

    if (!e.carrito || e.carrito.length === 0) {
      this.snackbar.showMessage('El carrito no posee detalles', 'warning');
      return;
    }

    this.dialog.open(HistoricoCompraComponent, {
      data: e,
      minHeight: '30vh'
    });
  }

  openDialogDatos(e: CompraUsuario): void  {
    if (!e.carrito || e.carrito.length === 0) {
      this.snackbar.showMessage('El carrito no posee detalles', 'warning');
      return;
    }

    this.dialog.open(DatosCompraComponent, {
      //height: '30%',
      // width: '50%',
      minHeight: '75vh',
      data: e,
    });
  }
}
