import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { SettingsService } from 'app/services/settings.service';

@Injectable({
    providedIn: 'root',
})
export class DashboardService {

    fechaDesde = '';
    fechaHasta = '';

    meses = [
        { key: 'Enero', value: 1 },
        { key: 'Febrero', value: 2 },
        { key: 'Marzo', value: 3 },
        { key: 'Abril', value: 4 },
        { key: 'Mayo', value: 5 },
        { key: 'Junio', value: 6 },
        { key: 'Julio', value: 7 },
        { key: 'Agosto', value: 8 },
        { key: 'Setiembre', value: 9 },
        { key: 'Octubre', value: 10 },
        { key: 'Noviembre', value: 11 },
        { key: 'Diciembre', value: 12 },
    ];

    anhos = [2020, 2021, 2022];

    actualizarDatosFecha: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(private http: HttpClient, private settings: SettingsService) {}
    /**
     * Recupera listado de solicitudes de credito por estado
     *
     * @param filtro filtro de fechas
     * @returns observable con datos de solicitudes
     */
    getSolicitudesCreditoPorEstado(filtro: any): Observable<any> {
        filtro = {
            fechaDesde: this.fechaDesde,
            fechaHasta: this.fechaHasta,
        };

        return this.http.post(
            `${this.settings.URL_BASE}fraccionate/credito_estado`,
            filtro
        );
    }

    /**
     * Recupera listado de solicitudes de monto por estado
     *
     * @param filtro filtro de fechas
     * @returns observable con datos de solicitudes
     */
    getSolicitudesMontoPorEstado(filtro: any): Observable<any> {
        filtro = {
            fechaDesde: this.fechaDesde,
            fechaHasta: this.fechaHasta,
        };

        return this.http.post(
            `${this.settings.URL_BASE}fraccionate/solicitud_monto_estado`,
            filtro
        );
    }

    /**
     * Recupera listado de cantidad de solicitudes por estado
     *
     * @param filtro filtro de fechas
     * @returns observable con datos de solicitudes
     */
    getSolicitudesPorEstado(filtro: any): Observable<any> {
        filtro = {
            fechaDesde: this.fechaDesde,
            fechaHasta: this.fechaHasta,
        };

        return this.http.post(
            `${this.settings.URL_BASE}fraccionate/solicitud_estado`,
            filtro
        );
    }

    /**
     * Recupera listado de solicitudes por cada monto [update: nuevo formato de estructura para apex charts]
     *
     * @param filtro filtro de fechas
     * @returns observable con datos de solicitudes
     */
    getSolicitudesPorMonto(filtro: any): Observable<any> {
        filtro = {
            fechaDesde: this.fechaDesde,
            fechaHasta: this.fechaHasta,
            // estadoSolicitudId: 1,
        };

        return this.http.post(
            `${this.settings.URL_BASE}fraccionate/solicitud_monto`,
            filtro
        );
    }

    /**
     * Recupera cantidad de fraccionamientos por plazo [update: nuevo formato de estructura para apex charts]
     *
     * @param filtro filtro de fechas
     * @returns observable con datos de solicitudes
     */
    getCantidadFraccionamientosPorPlazo(filtro: any): Observable<any> {
        filtro = {
            fechaDesde: this.fechaDesde,
            fechaHasta: this.fechaHasta,
            // estadoSolicitudId: 1,
            // estadoTransaccionId: 1
        };

        return this.http.post(
            `${this.settings.URL_BASE}fraccionate/fraccionamiento_plazo`,
            filtro
        );
    }

    /**
     * Recupera cantidad de solicitudes por monto y estado [update: nuevo formato de estructura para apex charts]
     *
     * @param filtro filtro de fechas
     * @returns observable con datos de solicitudes
     */
    getCantidadSolicitudesMonto(filtro: any): Observable<any> {
        filtro = {
            fechaDesde: this.fechaDesde,
            fechaHasta: this.fechaHasta,
            estadoSolicitudId: 1,
        };

        return this.http.post(
            `${this.settings.URL_BASE}fraccionate/solicitud_monto_estado`,
            filtro
        );
    }

    /**
     * Recupera el total de solicitudes de crédito
     *
     * @param filtro filtro de fechas
     * @returns observable con datos de solicitudes
     */
    getTotalSolicitudesCredito(filtro: any): Observable<any> {
        filtro = {
            fechaDesde: this.fechaDesde,
            fechaHasta: this.fechaHasta,
        };

        return this.http.post(
            `${this.settings.URL_BASE}fraccionate/total_solicitud`,
            filtro
        );
    }

    /**
     * Recupera el total general para la cabecera del dashboard
     *
     * @param filtro filtros de fecha
     * @returns
     */
    getTotalResumen(filtro: any): any {
        filtro = {
            fechaDesde: this.fechaDesde,
            fechaHasta: this.fechaHasta,
        };
        return this.http.post(
            `${this.settings.URL_BASE}fraccionate/total_resumen`,
            filtro
        );
    }
}
