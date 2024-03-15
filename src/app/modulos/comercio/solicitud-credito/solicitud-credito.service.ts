import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SettingsService} from "../../../services/settings.service";

@Injectable({
  providedIn: 'root'
})
export class SolicitudCreditoService {

  constructor(
    public  http: HttpClient,
    private settings: SettingsService
  ) { }

  obtenerListaSolicitudCredito(filtro: any) {
    return this.http.post(this.settings.URL_BASE + 'fraccionate/solicitud/credito/list', filtro);
  }

  /**
   * Método para obtener la lista de los estaddos de solicitud de crédito
   * @returns lista de estados de solicitud de crédito
   */
  obtenerListaEstaddoSolicitudCredito(cantidad = 20) {
    return this.http.get(this.settings.URL_BASE + 'public/solicitud_credito_estado' + (cantidad ? '?cantidad=' + cantidad : ''));
  }

  /**
   * Método para obtener la lista de compra de una solicitu
   * @returns lista de compra de una solicitud
   */
  obtenerListaCompra(idSolicitud:number) {
    return this.http.get(this.settings.URL_BASE + 'fraccionate/solicitud/credito/compra/' + (idSolicitud ? idSolicitud : ''));
  }
}
