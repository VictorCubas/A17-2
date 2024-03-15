/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { NavigationExtras, Router } from '@angular/router';
import { SnackbarService } from 'app/services/snackbar-service.service';
import { PageHeaderData } from 'app/shared-comercio/components/forms-header/page-header-data';
import { PageHeaderDataService } from 'app/shared-comercio/services/page-header-data.service';
import { DocumentoComercioService } from '../documento-comercio.service';

@Component({
    selector: 'app-lista-documento',
    templateUrl: './lista-documento.component.html',
    styles: [
        `
            .tbl-content {
                min-height: 60vh;
                max-height: 68vh;
                overflow-y: auto;

                table {
                    width: 100%;
                    min-width: 800px;
                }
            }
        `,
    ],
})
export class ListaDocumentoComponent implements OnInit {
    // columnas para la tabla
    displayedColumns = [
        'fechaCarga',
        'documentoUrl',
        'documentoTipo',
        'acciones',
    ];

    filtroDateKeys = {
        fechaSolicitud: true,
    };

    filtroSelectKeys = {
        estadoSolicitudId: true,
        franquiciaId: true,
    };

    dataSource: Array<Documento> = [];
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
        cantidad_pagina: 10,
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
        private service: DocumentoComercioService,
        private snackbar: SnackbarService,
        private router: Router // public dialog: MatDialog,
    ) {}

    ngOnInit(): void {
        this.paginacion = {};
        this.obtenerListado(1);
        this.headerDataService.setHeaderData(
            new PageHeaderData(
                'Documentos del Comercio',
                'comercio/documentos/adjuntar',
                false,
                true
            )
        );
    }

    obtenerDatos(event?: PageEvent | any): any {
        let pagina = 1;
        pagina = event.pageIndex + 1;

        if (event.pageIndex === 0 && event.previousPageIndex === 1) {
            pagina = 1;
        }
        this.size = event.pageSize;
        this.pagina = pagina;
        this.obtenerListado(pagina);
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
            this.obtenerListado(1);
            clearTimeout(this.filterTimer);
        }, 500);
    }

    /**
     * Funcion para obtener la lista de solicitudes de credito existentes
     */
    obtenerListado(page: number): any {
        this.filter.pagina = page;
        this.filter.cantidadPagina = 10;
        this.service
            .obtenerListadoDocumentos(this.filter)
            .subscribe((data: any) => {
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
                        total: 0,
                    };
                }
                this.snackbar.noMessage();
            });
    }

    editar(e: any): any {
        console.log(e);
        const data: NavigationExtras = {
            state: e,
        };

        this.router.navigate(['comercio/documentos/adjuntar'], data);
    }

    ver(e: any): any {}

    eliminar(e: any): any {}

    /**
     * Limpia campos de fehca
     *
     * @param campo nombre del filtro a limpiar
     * @param $event componente a limpiar en el html
     */
    // clearDate(campo: string, $event: MatDatepicker<any>) {
    //   this.filter[campo] = '';
    // }

    // openDialog(e: CompraUsuario): void  {
    //   console.log('lista de compra')

    //   if (!e.carrito || e.carrito.length === 0) {
    //     this.snackbar.showMessage('El carrito no posee detalles', 'warning');
    //     return;
    //   }

    //   const dialogRef = this.dialog.open(HistoricoCompraComponent, {
    //     data: e,
    //   });
    // }
}

export interface Documento {
    id: number;
    fechaCarga: string;
    documentoUrl: string;
    documentoTipo: any;
}
