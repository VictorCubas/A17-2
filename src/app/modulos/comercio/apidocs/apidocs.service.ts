import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SettingsService} from "../../../services/settings.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApidocsService {

  constructor(
    public http: HttpClient,
    public settings: SettingsService
  ) { }

  /**
   * Método para obtener el apikeys de un comercio
   * */
  getURLDocumentacion(): Observable<any>{
    return this.http.get(this.settings.URL_BASE +'fraccionate/apidocs');
  }
}
