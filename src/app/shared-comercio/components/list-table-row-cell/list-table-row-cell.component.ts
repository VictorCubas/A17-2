import {Component, Input, OnInit} from '@angular/core';

export class OptionTableCell {
    tipo!: string; // 'date' | 'boolean' | 'currency' |  'slice'
    sliceInicio!: number;
    sliceFin?: number;
}

@Component({
    selector: 'app-list-table-row-cell',
    templateUrl: './list-table-row-cell.component.html',
    styleUrls: ['./list-table-row-cell.component.scss']
})
export class ListTableRowCellComponent implements OnInit {

    @Input() row!: string | Date | number | boolean | any;
    /**
     * aca tiene que indicar si es un tipo string simple, si es fecha si es booleano o si quier eun icono. a desarrollar todavia lo de los
     * iconos.
     */
    @Input() options!: OptionTableCell;
    isTrue!: boolean;
    tipo!: string;

    constructor() {
    }

    ngOnInit(): void {
        this.tipo = this.options !== undefined ? this.options.tipo : 'text';
        if (this.tipo === 'boolean') {
            this.isTrue = this.row === 'true' || this.row === true;
        }
        if (this.tipo === 'slice') {
            this.options.sliceInicio = this.options.sliceInicio ?? 0;
            this.options.sliceFin = this.options.sliceFin ?? 100;
        }
    }
}
