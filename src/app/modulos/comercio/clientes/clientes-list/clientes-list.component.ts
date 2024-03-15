/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { SnackbarService } from 'app/services/snackbar-service.service';
import { PageHeaderData } from 'app/shared-comercio/components/forms-header/page-header-data';
import { PageHeaderDataService } from 'app/shared-comercio/services/page-header-data.service';
import { ClientesService } from '../clientes.service';

@Component({
  selector: 'app-clientes-list',
  templateUrl: './clientes-list.component.html',
  styleUrls: []
})
export class ClientesListComponent implements OnInit {
// columnas para la tabla
  displayedColumns = ['nroDocumento','nombre','apellido','telefono', 'fechaHora'];
  dataSource: Array<Cliente> = [];
  //paginacion: any;
  panelOpenState = false;
  filter: any = {
    // filtros
    nroDocumento: '',
    nombre: '',
    apellido: '',
    codigoCliente: '',
    sincronizacionEstadoId: '',

    // paginado
    pagina: 1,
    //cantidad_pagina: 10
  };
  estadoList: any[] = [];
  filterTimer: any;
  paginacion: any = {
    cantidad: 1,
    actual: 1,
    por_pagina: 10,
    total: 1
  };

  size = 0;
  pagina = 0;

  filtroSelectKeys = {
    sincronizacionEstadoId: true,
  };

  constructor(
    private headerDataService: PageHeaderDataService,
    public fb: FormBuilder,
    private clienteService: ClientesService,
    private snackbar: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.paginacion = {};
    this.headerDataService.setHeaderData(new PageHeaderData('Lista de Corredores', 'comercio/clientes', false));
    this.obtenerEstadoSincronizacion();
    this.obtenerListaCliente(1);
  }

  obtenerDatos(event?: PageEvent | any): any {
    let pagina = 1;
    pagina = event.pageIndex + 1;

    if (event.pageIndex === 0 && event.previousPageIndex === 1) {
      pagina = 1;
    }
    this.size = event.pageSize;
    this.pagina = pagina;
    this.obtenerListaCliente(pagina);
    return event;
  }

  buscarCampo(key: string, value: string | number): any {
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
      this.obtenerListaCliente(1);
      clearTimeout(this.filterTimer);
    }, 500);
  }

  /**
   * Funcion para obtener la lista de cliente
   */
  private obtenerListaCliente(page: number): any {
    this.filter.pagina = page;
    this.filter.cantidadPagina = 10;
    this.clienteService.obtenerListaCliente(this.filter)
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


  private obtenerEstadoSincronizacion(): any {
    this.clienteService.obtenerListaEstaddoSincronizacion()
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

}

export interface Cliente {
  id: string;
  id_cliente_entidad: string;
  fechaHora: string;
  nroDocumento: string;
  telefono: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  verificado: string;
  sincronizacionEstado: string;
}
