import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingsService } from 'app/services/settings.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ConfiguracionComercioService {
    constructor(private http: HttpClient, private settings: SettingsService) {}

    // #1 seccion datos de empresa

    getTipoEmpresa(): Observable<any> {
        return this.http.get(
            `${this.settings.URL_BASE}fraccionate/comercio/empresa/tipo`
        );
    }

    getSeccionesDisponibles(): Observable<any> {
        return this.http.get(
            `${this.settings.URL_BASE}fraccionate/comercio/seccion/disponible`
        );
    }

    getDatosEmpresa(): Observable<any> {
        return this.http.get(
            `${this.settings.URL_BASE}fraccionate/comercio/empresa/datos`
        );
    }

    guardarDatosEmpresa(data: any): Observable<any> {
        return this.http.post(
            `${this.settings.URL_BASE}fraccionate/comercio/empresa/datos`,
            data
        );
    }

    // #2 seccion de firmantes

    getFirmantes(): Observable<any> {
        return this.http.get(
            `${this.settings.URL_BASE}fraccionate/comercio/empresa/firmantes`
        );
    }

    guardarFirmante(data: any): Observable<any> {
        return this.http.post(
            `${this.settings.URL_BASE}fraccionate/comercio/empresa/firmantes`,
            data
        );
    }

    removerFirmante(id: number): Observable<any> {
        return this.http.delete(
            `${this.settings.URL_BASE}fraccionate/comercio/empresa/firmantes/${id}`
        );
    }

    // #3 seccion de datos de cuenta

    getDatosBanco(): Observable<any> {
        return this.http.get(
            `${this.settings.URL_BASE}fraccionate/comercio/banco/cuenta`
        );
    }

    guardarDatosBanco(data: any): Observable<any> {
        return this.http.post(
            `${this.settings.URL_BASE}fraccionate/comercio/banco/cuenta`,
            data
        );
    }

    // #4 seccion de documentos de la empresa

    getDocumentosEmpresa(): Observable<any> {
        return this.http.get(
            `${this.settings.URL_BASE}fraccionate/comercio/empresa/documento`
        );
    }

    guardarDocumentosEmpresa(data: any): Observable<any> {
        return this.http.post(
            `${this.settings.URL_BASE}fraccionate/comercio/empresa/documento`,
            data
        );
    }

    /**
     * Enviar datos del comercio para verificación
     *
     * @returns verificacion del comercio en proceso
     */
    enviarDatosParaVerificar(): Observable<any> {
        return this.http.post(
            `${this.settings.URL_BASE}fraccionate/comercio/datos/enviar`,
            {}
        );
    }


    /**
     * Recupera la sección actual en donde debe comenzar a modificar
     * (seria la ultima seccion donde se guardo algun dato)
     *
     *
     * @returns ultima seccion editada
     */
    seccionActual(): Observable<any> {
        return this.http.get(
            `${this.settings.URL_BASE}/fraccionate/comercio/seccion/ultima`);
    }


}
