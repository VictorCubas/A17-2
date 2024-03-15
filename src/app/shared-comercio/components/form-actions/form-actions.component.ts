import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

@Component({
    selector: 'app-form-actions',
    templateUrl: './form-actions.component.html',
    styleUrls: ['./form-actions.component.scss']
})
export class FormActionsComponent implements OnInit {
    /**
     * label boton con tema color primary, default 'Guardar'.
     */
    @Input() labelBtnPrimary = 'Guardar';
    /**
     * label boton con tema color acent, default 'cancelar'.
     */
    @Input() labelBtnAcent = 'Cancelar';
    /*
     * label de botón con tema color warn.
     */
    @Input() labelBtnWarn = 'Eliminar';

    /**
     * oculta boton primary, Default false.
     */
    @Input() set hideBtnPrimary(val: boolean) {
        this._hideBtnPrimary = val || false;
    }

    /**
     * oculta boton acent, Default false.
     */
    @Input() set hideBtnAcent(val: boolean) {
        this._hideBtnAcent = val || false;
    }

    /**
     * oculta boton warn, Default false.
     */
    @Input() set hideBtnWarn(val: boolean) {
        this._hideBtnWarn = val || false;
    }

    /**
     * Disabled boton primary, Default false.
     */
    @Input() set disabledBtnPrimary(val: boolean) {
        this._disabledBtnPrimary = val || false;
    }

    /**
     * Disabled boton acent, Default false.
     */
    @Input() set disableBtnAcent(val: boolean) {
        this._disabledBtnAcent = val || false;
    }

    /**
     * Disabled boton warn, Default false.
     */
    @Input() set disabledBtnWarn(val: boolean) {
        this._disabledBtnWarn = val || false;
    }

    /**
     * Input que deshabilita todos los botones mientras sea true, default false.
     * tambien habilita el spinner para el boton que tuvo accion de click.
     */
    @Input() submitted = false;

    /**
     * event emiter del boton primary.
     */
    @Output() primaryEmiter: EventEmitter<null> = new EventEmitter<null>();
    /**
     * event emiter del boton acent.
     */
    @Output() acentEmiter: EventEmitter<null> = new EventEmitter<null>();
    /**
     * event emiter del boton warn.
     */
    @Output() warnEmiter: EventEmitter<null> = new EventEmitter<null>();

    _hideBtnPrimary = false;
    _hideBtnAcent = false;
    _hideBtnWarn = false;
    _disabledBtnPrimary = false;
    _disabledBtnAcent = false;
    _disabledBtnWarn = false;
    // Estos son indicadores para identificar que boton puede mostrar el spinner en conjunto con el submitted.
    _spinnerBtnPrimary = false;
    _spinnerBtnAcent = false;
    _spinnerBtnWarn = false;

    constructor() {
    }

    ngOnInit(): void {

    }

    guardar(): void {
        this._spinnerBtnPrimary = true;
        this._spinnerBtnAcent = this._spinnerBtnWarn = false;
        this.primaryEmiter.emit();
    }

    cancelar(): void {
        this._spinnerBtnAcent = true;
        this._spinnerBtnPrimary = this._spinnerBtnWarn = false;
        this.acentEmiter.emit();
    }

    eliminar(): void {
        this._spinnerBtnWarn = true;
        this._spinnerBtnPrimary = this._spinnerBtnAcent = false;
        this.warnEmiter.emit();
    }

}
