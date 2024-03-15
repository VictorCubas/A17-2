import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SettingsService} from "../../services/settings.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RegistroUsuarioService {

  constructor(
    private http: HttpClient,
    private settings: SettingsService,
  ) { }


  /**
   * Permite registrar una persona o comercio
   *
   * @param data datos de registro
   * @returns subscripcion a un registro exitoso
   */
  registrar(data: any): Observable<any> {

    data = {
      ...data,
      ...{
        aplicacionId: this.settings.getAppId(),
        aplicacionVersion: this.settings.APP_VERSION
      },
    }

    return this.http.post(`${this.settings.URL_BASE}fraccionate/cliente`, data);

  }
}
