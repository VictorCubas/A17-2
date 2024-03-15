import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SettingsService } from 'app/services/settings.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentoComercioService {
  constructor(private http: HttpClient, private settings: SettingsService) {}

  getTipoDocumento(): Observable<any> {
    return this.http.get(
      `${this.settings.URL_BASE}fraccionate/comercio/documento/tipo`
    );
  }

  enviarArchivo(tipoId: number, data: any): Observable<any> {
    return this.http.post(
      `${this.settings.URL_BASE}fraccionate/comercio/documento/tipo/${tipoId}/documento`,
      data
    );
  }

  obtenerListadoDocumentos(filtro: any): any {
    return this.http.post(
      this.settings.URL_BASE + 'fraccionate/comercio/documento/list',
      filtro
    );
  }
}
