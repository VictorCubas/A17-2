import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { Comercio } from 'app/clases/comercio';
import { SnackbarService } from 'app/services/snackbar-service.service';
import { PageHeaderData } from 'app/shared-comercio/components/forms-header/page-header-data';
import { PageHeaderDataService } from 'app/shared-comercio/services/page-header-data.service';
import { Listas } from 'app/_helpers/clases/listas';
import { Subject, takeUntil } from 'rxjs';
import { ComercioService } from '../comercio.service';

@Component({
    selector: 'app-comercio-list',
    templateUrl: './comercio-list.component.html',
    styleUrls: ['./comercio-list.component.scss'],
})
export class ComercioListComponent extends Listas<Comercio> implements OnInit {

    @ViewChild('matTable') matTable!: MatTable<any>;
    unsubscribe$: Subject<any> = new Subject();
    dataSource = [];
    displayedColumns = ['nombre_fantasia', 'ruc', 'telefono', 'email', 'web', 'comercio_tipo', 'acciones'];
    paginacion = {
        cantidad: 1,
        actual: 1,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        por_pagina: 10,
        total: 1,
    };
    panelOpenState = false;
    private nombreTymer: any;
    private valorBuscar: any;



    constructor(
        public override router: Router,
        public service: ComercioService,
        public dialog: MatDialog,
        private headerDataService: PageHeaderDataService,
        private snackbar: SnackbarService
    ) {
        super(router, 'comercio/mis-comercios', service, dialog);
    }

    ngOnInit(): void {
        this.pagina = 1;

        this.paginacion = {
            cantidad: 1,
            actual: 1,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            por_pagina: 10,
            total: 1,
        };
        this.buscar('');
        this.headerDataService.setHeaderData(
            new PageHeaderData(
                'Mis Comercios',
                this.rutaPadre + '/registrar',
                false,
                true
            )
        );

        setTimeout(() => {
            this.obtenerDatos({});
        }, 500);

    }

    buscar(value: string): any {
        //this.persona.nombre = this.capitalizeFirstLetter(value);
        this.valorBuscar = value;
        console.log('Valor a buscar', this.valorBuscar);
        clearTimeout(this.nombreTymer);
        this.nombreTymer = setTimeout(() => {
            // this.getListaUsuario();
            clearTimeout(this.nombreTymer);
        }, 500);
    }

    /**
     * Recupera listado de comercios
     *
     * @param e filtro/evento de paginacion
     */
    obtenerDatos(event: any): void {

        let pagina = 1;
        pagina = event.pageIndex + 1;

        if (event.pageIndex === 0 && event.previousPageIndex === 1) {
            pagina = 1;
        }
        this.size = event.pageSize;
        this.pagina = pagina;

        this.service.obtenerLista({
            valorBuscar: this.valorBuscar,
            pagina: this.paginacion.actual,
            cantidadPagina: this.paginacion.por_pagina,
        }).pipe(takeUntil(this.unsubscribe$)).subscribe( (resp: any) => {
            this.dataSource = resp.data;
            this.paginacion = resp.pagination;
        });
    }
}
