import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SettingsService } from 'app/services/settings.service';
import { MetodosServicio } from 'app/_helpers/interfaces/metodos-servicio';
import { Rol } from 'app/clases/rol';

@Injectable({
  providedIn: 'root'
})
export class RolesService extends MetodosServicio<Rol> {

  constructor(
    public override http: HttpClient,
    private settings: SettingsService
  ) {
    super(http, 'fraccionate/usuario/rol', Rol);
  }

  restartItem(): void {
    this.setItem(new Rol());
  }


  /**
   * Método para obtener el pais de una persona según su id
   */
  obtenerRol(filtro: any): Observable<any> {
    return this.http.get(this.settings.URL_BASE + 'fraccionate/usuario/rol', filtro);
  }

  crearRol(data: any): Observable<any> {
    return this.http.post(this.settings.URL_BASE + 'rol', data);
  }

  actualizarRol(data: any, id: any): Observable<any> {
    return this.http.put(this.settings.URL_BASE + 'rol/' + id, data);
  }

  eliminarRol(id: any): Observable<any> {
    return this.http.delete(this.settings.URL_BASE + 'rol/' + id);
  }
}
