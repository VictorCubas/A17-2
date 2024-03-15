/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable quotes */
import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { SettingsService } from 'app/services/settings.service';

@Injectable({
  providedIn: 'root'
})
export class HistoricoComprasService {

  constructor(
    public  http: HttpClient,
    private settings: SettingsService
  ) { }

  obtenerListaSolicitudCredito(filtro: any): any {
    return this.http.post(this.settings.URL_BASE + 'fraccionate/comercio/carrito', filtro);
  }

  /**
   * Método para obtener la lista de los estaddos de solicitud de crédito
   *
   * @returns lista de estados de solicitud de crédito
   */
  obtenerListaEstaddoSolicitudCredito(cantidad = 20): any {
    return this.http.get(this.settings.URL_BASE + 'public/solicitud_credito_estado' + (cantidad ? '?cantidad=' + cantidad : ''));
  }

  /**
   * Método para obtener la lista de compra de una solicitud
   *
   * @returns lista de compra de una solicitud
   */
  obtenerListaCompra(idSolicitud: number): any {
    return this.http.get(this.settings.URL_BASE + 'fraccionate/solicitud/credito/compra/' + (idSolicitud ? idSolicitud : ''));
  }
}
