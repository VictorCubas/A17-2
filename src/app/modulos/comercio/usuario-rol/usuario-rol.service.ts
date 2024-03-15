import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BasicResponse } from 'app/clases/basic-response';
import { UsuarioRol } from 'app/clases/usuario-rol';
import { SettingsService } from 'app/services/settings.service';
import { MetodosServicio } from 'app/_helpers/interfaces/metodos-servicio';


@Injectable({
  providedIn: 'root'
})
export class UsuarioRolService extends MetodosServicio<UsuarioRol> {

  constructor(
    public override http: HttpClient,
    public settings: SettingsService,
  ) {
    super(http, 'fraccionate/usuario/rol', UsuarioRol);
  }

  restartItem(): void {
    this.setItem(new UsuarioRol());
  }

  /**
   * Método para obtener la lista de la relación usuario_rol según el usuario especifico
   *
   * @param filtro id del usurio
   * @returns la lista
   */
  override getAll(filtro?: string): Observable<BasicResponse<Array<any>>> {
    const params = new HttpParams()
      .set('filtro', filtro ?? '');
    return this.http.get<BasicResponse<Array<any>>>(`${this.settings.URL_BASE}fraccionate/usuario/rol`, {params});

  }
}
