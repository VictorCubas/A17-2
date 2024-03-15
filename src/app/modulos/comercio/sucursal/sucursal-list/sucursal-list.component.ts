import {Component, OnInit, ViewChild} from '@angular/core';
import {ComercioSucursal} from "../../../../clases/comercio-sucursal";
import {Listas} from "../../../../_helpers/clases/listas";
import {Subject, takeUntil} from "rxjs";
import {MatTable} from "@angular/material/table";
import {SnackbarService} from "../../../../services/snackbar-service.service";
import {Router} from "@angular/router";
import {SucursalService} from "../sucursal.service";
import {MatDialog} from "@angular/material/dialog";
import {PageHeaderDataService} from "../../../../shared-comercio/services/page-header-data.service";
import {PageHeaderData} from "../../../../shared-comercio/components/forms-header/page-header-data";
import {DialogConfirmComponent} from "../../../../shared-comercio/components/dialog-confirm/dialog-confirm.component";
import {PaisService} from "../pais.service";

@Component({
  selector: 'app-sucursal-list',
  templateUrl: './sucursal-list.component.html',
  styleUrls: []
})
export class SucursalListComponent extends Listas<ComercioSucursal> implements OnInit {
 /*   tableColumns: Array<any> = [
        { name: 'Nombre', val: 'nombre' },
        { name: 'Descripcion', val: 'descripcion' },
        { name: 'Barrio', val: 'barrio', nested: 'nombre', colSort: 'id' }
    ];*/

    unsubscribe$: Subject<any> = new Subject();
    private nombreTymer: any;
    private valorBuscar: any;

    dataSource = [];
    // eslint-disable-next-line @typescript-eslint/member-ordering
    displayedColumns = [
        'nombre',
        'descripcion',
        'barrio',
        'acciones'
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
    public service: SucursalService,
    public dialog: MatDialog,
    private headerDataService: PageHeaderDataService,
    private snackbar: SnackbarService,
  ) {
    super(router, 'comercio/comercio-sucursal', service, dialog);
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
      new PageHeaderData('Sucursales',
          this.rutaPadre + '/registrar',
          false, true)
    );
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

    getListaUsuario(): any {
        console.log('lista')
        this.service
            .obtenerListaSucursales(
                 this.valorBuscar,
                this.paginacion.por_pagina,
            )
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((resp) => {
                this.snackbar.noMessage();
                this.dataSource = resp.data;
                console.log(resp.data)
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
            });
    }

    confirmDelete(id: number): any {
        this.dialogConfirm(
            'Atención',
            '¿Confirma de que desea elminar el registro?',
            () => this.remover(id)
        );
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
}
