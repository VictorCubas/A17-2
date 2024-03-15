/* tslint:disable:variable-name */
/* tslint:disable:no-inferrable-types */

import {Router} from '@angular/router';
import {Directive} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Subject} from 'rxjs';
import {MetodosServicio} from "../interfaces/metodos-servicio";

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class Listas<T> {
    private _title: string = '';
    private _criterio: string = '';
    private _pagina: number = 0;
    private _start: number = 0;
    private _size: number = 10;
    private _ultimo: boolean = false;
    private _primero: boolean = false;
    private _totalPaginas: number = 0;
    private _lista: Array<any> = [];
    // private _lectorPermisos: LectorPermisos;
    public eventsSubject: Subject<void> = new Subject<void>();

    // get lectorPermisos(): LectorPermisos {
    //     return this._lectorPermisos;
    // }
    //
    // set lectorPermisos(value: LectorPermisos) {
    //     this._lectorPermisos = value;
    // }

    protected constructor(
        public router: Router,
        private _rutaPadre: string = '',
        private servicio: MetodosServicio<T>,
        public matDialog: MatDialog
    ) {
        this._title = '';
        this._criterio = '';
        this._pagina = 0;
        this._start = 0;
        this._size = 10;
        this._ultimo = false;
        this._primero = false;
        this._totalPaginas = 0;
        // this.lectorPermisos = new LectorPermisos(matDialog);

    }

    getBuscar(): void {
        this.servicio.getAll().subscribe((res: any) => {
            this.lista = res.data;
        });
    }


    editar(item: any): void {
        this.router.navigate([`/${this.rutaPadre}/modificar`]).then(() => null);
        this.servicio.setItem(item);
    }

    ver(item: T | any): void {
        this.router.navigate([`/${this.rutaPadre}/ver`]).then(() => null);
        this.servicio.setItem(item);
    }

    eliminar(id: any): void {
        // if (!this.lectorPermisos.permisosBotones('eliminar', true, this.rutaPadre)) {
        //     return;
        // }
        this.servicio.delId(id).subscribe(() => {
            this.eventsSubject.next();
        });
    }

    get title(): string {
        return this._title;
    }

    set title(value: string) {
        this._title = value;
    }


    get pagina(): number {
        return this._pagina;
    }

    set pagina(value: number) {
        this._pagina = value;
    }

    get start(): number {
        return this._start;
    }

    set start(value: number) {
        this._start = value;
    }

    get size(): number {
        return this._size;
    }

    set size(value: number) {
        this._size = value;
    }

    get ultimo(): boolean {
        return this._ultimo;
    }

    set ultimo(value: boolean) {
        this._ultimo = value;
    }


    get rutaPadre(): string {
        return this._rutaPadre;
    }

    set rutaPadre(value: string) {
        this._rutaPadre = value;
    }

    get lista(): Array<T> {
        return this._lista;
    }

    set lista(value: Array<T>) {
        this._lista = value;
    }
}
