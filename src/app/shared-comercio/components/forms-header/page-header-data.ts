/* eslint-disable @typescript-eslint/member-ordering */
/* tslint:disable:variable-name */

export class PageHeaderData {
    /**
     * Indíca el título de la página actual.
     *
     * @private
     */
    private _titulo: string;
    /**
     * Link de la página a la cuál se dirigirá en el botón de acción
     *
     * @private
     */
    private _linkT: string;
    /**
     * Indica si la página a actual es un formulario o no, en caso de no serlo es una lista o un componente que no necesita acción.
     *
     * @private
     */
    private _esFormulario: boolean;
    /**
     * Indica si el botón agregar debe ser visible, es visible para las listas, el botón agregar redirige al formulario de dicha lista en
     * caso que así se quiera.
     *
     * @private
     */
    private _btnAgregar: boolean;
    /**
     * En caso que sea necesario ocultar el título enviar false en esta variable, es una funcionalidad pensada para los cos en los cuales
     * se quiera acceder el componente de la página por medio de un diálogo en lugar de una ruta.
     *
     * @private
     */
    private _visible = true;

    constructor(
        titulo?: string,
        linkT?: string,
        esFormulario?: boolean,
        btnAgregar?: boolean,
        visible?: boolean
    ) {
        this._titulo = titulo ?? '';
        this._linkT = linkT ?? '';
        this._esFormulario = esFormulario ?? false;
        this._btnAgregar = btnAgregar ?? false;
        this._visible = visible ?? true;
    }

    get titulo(): string {
        return this._titulo;
    }

    set titulo(value: string) {
        this._titulo = value;
    }

    get linkT(): string {
        return this._linkT;
    }

    set linkT(value: string) {
        this._linkT = value;
    }

    get esFormulario(): boolean {
        return this._esFormulario;
    }

    set esFormulario(value: boolean) {
        this._esFormulario = value;
    }

    get btnAgregar(): boolean {
        return this._btnAgregar;
    }

    set btnAgregar(value: boolean) {
        this._btnAgregar = value;
    }

    get visible(): boolean {
        return this._visible;
    }

    set visible(value: boolean) {
        this._visible = value;
    }
}
