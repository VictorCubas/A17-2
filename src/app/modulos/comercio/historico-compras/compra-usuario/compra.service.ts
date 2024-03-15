import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SettingsService } from 'app/services/settings.service';

@Injectable({
    providedIn: 'root'
})
export class CompraUsuarioService {

    constructor(
        private http: HttpClient,
        private settings: SettingsService,
    ) {

    }

    /**
     * Recupera el listado de cuotas en base a un importe recibido como parámetro
     *
     * @param importe el importe total del producto
     * @returns retorna listado de cuotas
     */
    getCuotas(importe: number): Observable<any> {
        return this.http.get(`${this.settings.URL_BASE}fraccionate/cuota/${importe}`);
    }

    cargarPersonaCompra(data: null): Observable<any> {
        return this.http.post(`${this.settings.URL_BASE}fraccionate/persona`, data);
    }

}
