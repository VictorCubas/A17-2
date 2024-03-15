import { Injectable } from '@angular/core';
import { MetodosServicio } from '../../../_helpers/interfaces/metodos-servicio';
import { ComercioSucursal } from '../../../clases/comercio-sucursal';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SettingsService } from '../../../services/settings.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { BasicResponse } from '../../../_helpers/clases/basic-response';
import { Comercio } from 'app/clases/comercio';

@Injectable({
    providedIn: 'root',
})
export class ComercioService extends MetodosServicio<Comercio> {

    // emisor de valores para nuevo comercio
    updateComercioSelector: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(
        public override http: HttpClient,
        public settings: SettingsService
    ) {
        super(
            http,
            settings.URL_BASE + 'fraccionate/comercio/mis-comercios',
            Comercio
        );
    }

    restartItem(): void {
        this.setItem(new Comercio());
    }

    override delId(id: any): Observable<any> {
        return this.http.delete(
            this.settings.URL_BASE + 'public/comercio/' + id
        );
    }

    /**
     * Recupera el listado de comercios del usuario
     *
     * @param filtro filtros para el listado
     * @returns listado de comercios del usuario
     */
    obtenerLista(
        filtro = { cantidadPagina: 10, pagina: 1, valorBuscar: '' }
    ): Observable<any> {
        // const params = new HttpParams()
        //     .set('filtro', filtro ?? '')
        //     .set('cantidad', cantidad !== 'undefined' ? cantidad : '10')
        //     .set('pagina', pagina ?? '0');
        /*          .set('orden', orden ?? 'ASC')
            .set('columna', columna ?? 'id');*/
        return this.http.post(
            `${this.settings.URL_BASE}fraccionate/comercio/list/usuario`,
            filtro
        );
    }

    /**
     * Permite registrar un comercio
     *
     * @param data datos de registro
     * @returns subscripcion a un registro exitoso
     */
    registrar(data: any, logo: any): Observable<any> {

        const formData = new FormData();

        formData.append('aplicacionId', this.settings.getAppId());
        formData.append('aplicacionVersion', this.settings.APP_VERSION);
        formData.append('nombre', data.nombre);
        formData.append('comercioEmail', data.comercioEmail);
        formData.append('comercioTelefono', data.comercioTelefono);
        formData.append('comercioTipoId', data.comercioTipoId);
        formData.append('web', data.web);
        formData.append('facebook', data.facebook);
        formData.append('instagram', data.instagram);
        formData.append('twitter', data.twitter);
        formData.append('ruc', data.ruc);
        formData.append('logo', logo);

        return this.http.post(
            `${this.settings.URL_BASE}fraccionate/comercio/agregar`,
            formData
        );
    }

    /**
     * Permite actualizar un comercio
     *
     * @param data datos de registro
     * @returns subscripcion a un registro exitoso
     */
    actualizar(data: any, id: number, logo: any = null): Observable<any> {

        const formData = new FormData();

        formData.append('aplicacionId', this.settings.getAppId());
        formData.append('aplicacionVersion', this.settings.APP_VERSION);
        formData.append('nombre', data.nombre);
        formData.append('comercioEmail', data.comercioEmail);
        formData.append('comercioTelefono', data.comercioTelefono);
        formData.append('comercioTipoId', data.comercioTipoId);
        formData.append('web', data.web);
        formData.append('facebook', data.facebook);
        formData.append('instagram', data.instagram);
        formData.append('twitter', data.twitter);
        formData.append('ruc', data.ruc);
        formData.append('logo', logo);

        return this.http.put(
            `${this.settings.URL_BASE}fraccionate/comercio/modificar/${id}`,
            formData
        );
    }

    /**
     * Recupera listado de comercios en plano
     *
     * @returns listado de comercios
     */
    getComerciosFromServer(): Observable<any> {
        return this.http.get(`${this.settings.URL_BASE}fraccionate/comercio`);
    }

    /**
     * Recupera la lista de tipos de comercio disponible
     *
     * @returns lista de comercios
     */
     getTipoComercio(): Observable<any> {
        return this.http.get(
            `${this.settings.URL_BASE}fraccionate/comercio/tipo`
        );
    }
}
