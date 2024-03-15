import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SettingsService} from "../../../services/settings.service";
import {Observable} from "rxjs";
import {MetodosServicio} from "../../../_helpers/interfaces/metodos-servicio";
import {Apikeys} from "../../../clases/apikeys";

@Injectable(
  {providedIn: 'root'}
)
export class ApikeysService  extends MetodosServicio<Apikeys>{

  constructor(
    public override http: HttpClient,
    public settings: SettingsService
  ) {
    super(http, 'fraccionate/apikeys', Apikeys);
  }

  restartItem() {}


  /**
   * Método para obtener el apikeys de un comercio
   * */
  getApikeysByComercio(): Observable<any>{
    return this.http.get(this.settings.URL_BASE +'fraccionate/apikeys');
  }

  /**
   * Método para actualizar clave publica
   * */
  updateClavePublica(data:any, id:number) {
    return this.http.put(this.settings.URL_BASE +'fraccionate/apikeys/'+id,data);
  }

  /**
   * Método para resetear apiKey
   * */
  resetearApiKey(data:any) {
    return this.http.post(this.settings.URL_BASE +'fraccionate/apikeys/resetear',data);
  }

}
