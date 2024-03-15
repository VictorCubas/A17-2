import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { MetodosServicio } from 'app/_helpers/interfaces/metodos-servicio';
import {Observable} from 'rxjs';
import {Pais} from '../../../clases/pais';
import {SettingsService} from '../../../services/settings.service';


@Injectable({
  providedIn: 'root',
})
export class PaisService extends MetodosServicio<Pais> {

  constructor(
    public override http: HttpClient,
    private settings: SettingsService
  ) {
    super(http, settings.URL_BASE+'public/pais', Pais);
    console.log(this.settings.URL_BASE);
  }

  restartItem(): void {
    this.setItem(new Pais());
  }


  /**
   * Método para obtener el pais de una persona según su id
   */
  obtenerPais(filtro: any): Observable<any> {
    return this.http.get(this.settings.URL_BASE + 'public/pais', filtro);
  }

  crearPais(data: any): Observable<any> {
    return this.http.post(this.settings.URL_BASE + 'public/pais', data);
  }

  actualizarPais(data: any, id: any): Observable<any> {
    return this.http.put(this.settings.URL_BASE + 'public/pais/' + id, data);
  }

  eliminarPais(id: any): Observable<any> {
    return this.http.delete(this.settings.URL_BASE + 'public/pais/' + id);
  }


}
