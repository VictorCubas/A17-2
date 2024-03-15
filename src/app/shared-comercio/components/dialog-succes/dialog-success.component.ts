import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-dialog-succes',
    templateUrl: './dialog-success.component.html',
    styleUrls: ['./dialog-success.component.scss']
})
export class DialogSuccessComponent implements OnInit {

    constructor(
        public dialogSuccessRef: MatDialogRef<DialogSuccessComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    }

    ngOnInit(): any {
    }

    public aceptar(): any {
        this.dialogSuccessRef.close('aceptar');
    }

    public cerrar(): any {
        this.dialogSuccessRef.close('cerrar');
    }

}
