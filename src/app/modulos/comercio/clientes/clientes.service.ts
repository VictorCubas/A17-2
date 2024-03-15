import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SettingsService} from "../../../services/settings.service";

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(
    public  http: HttpClient,
    private settings: SettingsService
  ) { }

  obtenerListaCliente(filtro: any) {
    return this.http.post(this.settings.URL_BASE + 'fraccionate/comercio/cliente', filtro);
  }

  /**
   * Método para obtener la lista de los estaddos de sincronizacion
   * @returns lista de estados de sincronizacion
   */
  obtenerListaEstaddoSincronizacion(cantidad = 20) {
    return this.http.get(this.settings.URL_BASE + 'public/sincronizacion_estado' + (cantidad ? '?cantidad=' + cantidad : ''));
  }
}
