import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from 'app/clases/usuario';
import { SettingsService } from 'app/services/settings.service';
import { MetodosServicio } from 'app/_helpers/interfaces/metodos-servicio';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class UsuarioService extends MetodosServicio<Usuario> {
  constructor(
    public override http: HttpClient,
    public settings: SettingsService
  ) {
    super(http, 'fraccionate/usuario', Usuario);
  }

  restartItem(): any {}

  getListaUsuario(
    filtro = { cantidadPagina: 10, pagina: 1, valorBuscar: '' }
  ): Observable<any> {
    return this.http
      .post(`${this.settings.URL_BASE}fraccionate/usuario/list`, filtro);
  }

  /**
   * Método para obtener roles de usuario
   */
   obtenerRol(filtro: any): Observable<any> {
    return this.http.get(this.settings.URL_BASE + 'fraccionate/usuario/rol', filtro);
  }

  /**
   * Guarda un registro.
   *
   * @param item Registro a ser guardado.
   */
   override save(item: any): Observable<any> {
    return this.http
      .post<any>(this.settings.URL_BASE + 'fraccionate/usuario', item)
      .pipe(map((res: any) => res.data));
  }

  /**
   * Actualiza un registro.
   *
   * @param item Registro a ser actualizado.
   */
  override update(item: any): Observable<any> {
    return this.http.put<any>(`${this.settings.URL_BASE}fraccionate/usuario/${item['id']}`, item);
  }

  /**
   * Elimina un registro.
   *
   * @param id Identicador único del registro a ser eliminado.
   */
   override delId(id: number): Observable<any> {
    return this.http.delete(`${this.settings.URL_BASE}fraccionate/usuario/${id}`);
  }

}
