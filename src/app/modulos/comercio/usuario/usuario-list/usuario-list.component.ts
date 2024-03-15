/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { Usuario } from 'app/clases/usuario';
import { SnackbarService } from 'app/services/snackbar-service.service';
import { DialogConfirmComponent } from 'app/shared-comercio/components/dialog-confirm/dialog-confirm.component';
import { PageHeaderData } from 'app/shared-comercio/components/forms-header/page-header-data';
import { PageHeaderDataService } from 'app/shared-comercio/services/page-header-data.service';
import { Listas } from 'app/_helpers/clases/listas';
import { Subject, takeUntil } from 'rxjs';

import { UsuarioService } from '../usuario.service';

@Component({
    selector: 'app-usuario-list',
    templateUrl: './usuario-list.component.html',
    styleUrls: [],
})
export class UsuarioListComponent extends Listas<Usuario> implements OnInit {
    unsubscribe$: Subject<any> = new Subject();
    private nombreTymer: any;
    private valorBuscar: any;

    dataSource = [];
    // eslint-disable-next-line @typescript-eslint/member-ordering
    displayedColumns = [
        'fechaAlta',
        'nombre',
        'apellido',
        'usuario',
        'correo',
        'rol',
        'activo',
        'acciones',
    ];
    paginacion = {
        cantidad: 1,
        actual: 1,
        por_pagina: 10,
        total: 1,
    };
    panelOpenState = false;

    @ViewChild('matTable') matTable!: MatTable<any>;

    constructor(
        public override router: Router,
        public service: UsuarioService,
        public dialog: MatDialog,
        private headerDataService: PageHeaderDataService,
        private snackbar: SnackbarService
    ) {
        super(router, 'comercio/usuario', service, dialog);
    }

    ngOnInit(): void {
        this.pagina = 1;

        //this.getListaUsuario();
        this.paginacion = {
            cantidad: 1,
            actual: 1,
            por_pagina: 10,
            total: 1,
        };
        this.buscar('');

        this.headerDataService.setHeaderData(
            new PageHeaderData(
                'Usuario',
                this.rutaPadre + '/registrar',
                false,
                true
            )
        );
    }

    getListaUsuario(): any {
        this.service
            .getListaUsuario({
                valorBuscar: this.valorBuscar,
                pagina: this.paginacion.actual,
                cantidadPagina: this.paginacion.por_pagina,
            })
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((resp) => {
                this.snackbar.noMessage();
                this.dataSource = resp.data;
                if (!(resp.length !== 0)) {
                    this.paginacion = resp.pagination;
                    this.matTable.renderRows();
                } else {
                    this.paginacion = {
                        actual: 1,
                        cantidad: 1,
                        por_pagina: 10,
                        total: 1,
                    };
                }

                // this.pagina = resp.pagination.cantidad;
                // this.size = resp.pagination.por_pagina;
            });
    }

    /**
     * Método para realizar acción según evento del paginado.
     *
     * @param event evento del paginado
     */

    public obtenerDatos(event?: any): any {
        let pagina = 1;
        pagina = event.pageIndex + 1;

        if (event.pageIndex === 0 && event.previousPageIndex === 1) {
            pagina = 1;
        }
        this.size = event.pageSize;
        this.pagina = pagina;
        this.getListaUsuario();
        return event;
    }

    confirmDelete(id: number): any {
        this.dialogConfirm(
            'Atención',
            '¿Confirma de que desea elminar el registro?',
            () => this.remover(id)
        );
    }

    dialogConfirm(titulo: string, message: string, callBack?: any): void {
        const data = {
            titulo,
            menssage: message,
            aceptarCancelar: true,
            textoBtnAceptar: 'Eliminar',
            textoBtnCerrar: 'Cancelar',
        };
        const modalSuccess = this.matDialog.open(DialogConfirmComponent, {
            data,
        });
        modalSuccess.afterClosed().subscribe((result) => {
            if (result === 'aceptar') {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                callBack ? callBack(result) : null;
            }
        });
    }

    remover(id: any): any {
        this.service
            .delId(id)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(() => {
                this.paginacion = {
                    cantidad: 1,
                    actual: 1,
                    por_pagina: 10,
                    total: 1,
                };
                this.getListaUsuario();
                this.matTable.renderRows();
            });

        // setTimeout( () => {
        //   // this.dataSource = [];
        //   this.paginacion = {
        //     cantidad: 1,
        //     pagina: 1,
        //     por_pagina: 10,
        //     total: 1
        //   };
        //   this.getListaUsuario();
        //   this.matTable.renderRows();
        // }, 6000)
    }

    // @ts-ignore
    onSearchInput(ev): void {
        //this.searchTarget = ev.target?.value ?? '';
        console.log(ev.target?.value ?? '');
    }

    buscar(value: string): any {
        //this.persona.nombre = this.capitalizeFirstLetter(value);
        this.valorBuscar = value;
        console.log('Valor a buscar', this.valorBuscar);
        clearTimeout(this.nombreTymer);
        this.nombreTymer = setTimeout(() => {
            this.getListaUsuario();
            clearTimeout(this.nombreTymer);
        }, 500);
    }
}
