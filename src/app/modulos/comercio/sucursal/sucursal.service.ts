import { Injectable } from '@angular/core';
import {MetodosServicio} from "../../../_helpers/interfaces/metodos-servicio";
import {ComercioSucursal} from "../../../clases/comercio-sucursal";
import {HttpClient, HttpParams} from "@angular/common/http";
import {SettingsService} from "../../../services/settings.service";
import {Usuario} from "../../../clases/usuario";
import {Observable} from "rxjs";
import {BasicResponse} from "../../../_helpers/clases/basic-response";

@Injectable({
  providedIn: 'root'
})
export class SucursalService extends MetodosServicio<ComercioSucursal>{

  constructor(
    public override http: HttpClient,
    public settings: SettingsService
  ) {
    super(http, settings.URL_BASE+'fraccionate/comercio/comercio-sucursal', ComercioSucursal);
  }

  restartItem(): void {
    this.setItem(new ComercioSucursal())
  }

 /* /!**
   * Método para obtener la lista de sucursales segun el comercio
   *!/
  obtenerSucursal(filtro: any): Observable<any> {
    console.log(this.settings.URL_BASE);
    return this.http.get(this.settings.URL_BASE + 'fraccionate/comercio/comercio-sucursal', filtro);
  }*/

  override delId(id: any): Observable<any> {
    return this.http.delete(this.settings.URL_BASE + 'public/comercio_sucursal/' + id);
  }

  /**
   * Método para obtener el barrio según su id
   * @param barrioID identificador del barrio
   */
  obtenerBarrio(queryParams: any = ''): Observable<any> {
    // return this.http.get(this.settings.URL_BASE + 'public/barrio'+ queryParams,filtro);
    return this.http.get(this.settings.URL_BASE + 'public/barrio?'+ queryParams);
  }

  obtenerDepartamento(queryParams: any = ''): Observable<any> {
    return this.http.get(this.settings.URL_BASE + 'public/departamento?'+ queryParams);
  }

  obtenerCiudad(queryParams: any = ''): Observable<any> {
    return this.http.get(this.settings.URL_BASE + 'public/ciudad?'+ queryParams);
  }

  geoInversa(latitude:number, longitude:number): Observable<any> {
      return this.http.get(this.settings.URL_BASE + 'fraccionate/comercio/comercio-sucursal/geo/inversa/'+ latitude+'/'+longitude);
  }

    obtenerListaSucursales(
        filtro?: string,
        cantidad?: string | any,
        pagina?: string,
/*        orden?: string,
        columna?: string*/
    ): Observable<any> {
        const params = new HttpParams()
            .set('filtro', filtro ?? '')
            .set('cantidad', cantidad != 'undefined' ? cantidad : '10')
            .set('pagina', pagina ?? '0')
  /*          .set('orden', orden ?? 'ASC')
            .set('columna', columna ?? 'id');*/
        return this.http
            .get(`${this.settings.URL_BASE}fraccionate/comercio/comercio-sucursal`,{ params });
    }
}
