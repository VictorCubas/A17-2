import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { SettingsService } from 'app/services/settings.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  constructor(
    private http: HttpClient,
    private settings: SettingsService,
  ) {
  }


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
    };

    return this.http.post(`${this.settings.URL_BASE}fraccionate/comercio`, data);

  }

  getTipoComercio(): Observable<any> {

    return this.http.get(`${this.settings.URL_BASE}fraccionate/comercio/tipo`);

  }

  getParametrosTyC(data: any): Observable<any> {
    return this.http.post(`${this.settings.URL_BASE}fraccionate/parametros`, data);
  }

}
