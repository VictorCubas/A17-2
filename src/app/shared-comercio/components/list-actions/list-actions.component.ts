import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-list-actions',
    templateUrl: './list-actions.component.html',
    styleUrls: ['./list-actions.component.scss']
})
export class ListActionsComponent implements OnInit {
    @Input() btnVer = true;
    @Input() btnEditar = true;
    @Input() btnBorrar = false;
    @Input() btnImprimir = false;
    @Input() btnAgregar = false;
    @Input() btnChec = false;
    @Input() btnOptionList!: boolean;

    @Input() btnChecTitle = '';
    @Input() btnImprimirTitle = '';

    @Input() dis = false;

    @Output() verEmitter: EventEmitter<null> = new EventEmitter<null>();
    @Output() editarEmitter: EventEmitter<null> = new EventEmitter<null>();
    @Output() borrarEmitter: EventEmitter<null> = new EventEmitter<null>();
    @Output() imprimirEmitter: EventEmitter<null> = new EventEmitter<null>();
    @Output() agregarEmitter: EventEmitter<null> = new EventEmitter<null>();
    @Output() checkEmitter: EventEmitter<null> = new EventEmitter<null>();

    constructor() {
    }

    ngOnInit(): void {
    }

    ver(): void {
        this.verEmitter.emit();
    }

    editar(): void {
        this.editarEmitter.emit();
    }

    borrar(): void {
        this.borrarEmitter.emit();
    }

    imprimir(): void {
        this.imprimirEmitter.emit();
    }

    agregar(): void {
        this.agregarEmitter.emit();
    }

    check(): void {
        this.checkEmitter.emit();
    }

}
