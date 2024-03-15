import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingsService } from 'app/services/settings.service';
import { Observable } from 'rxjs';

@Injectable()
export class SignUpService {
    constructor(private http: HttpClient, private settings: SettingsService) {}

    /**
     * Recupera la lista de tipos de comercio disponible
     *
     * @returns lista de comercios
     */
    getTipoComercio(): Observable<any> {
        return this.http.get(
            `${this.settings.URL_BASE}fraccionate/comercio/tipo`
        );
    }

   /**
    * Permite registrar una persona o comercio
    *
    * @param data datos de registro
    * @returns subscripcion a un registro exitoso
    */
  registrar(data: any, logo: any = null): Observable<any> {

    data = {
      ...data,
      ...{
        aplicacionId: this.settings.getAppId(),
        aplicacionVersion: this.settings.APP_VERSION
      },
    };

    const formData = new FormData();

    // usuario: ['', Validators.required],
    // telefono: ['', Validators.required],
    // email: ['', Validators.required],
    // fechaNacimiento: ['', Validators.required],
    // nombrePersona: ['', Validators.required],
    // apellidoPersona: ['', Validators.required],

    // comercio
    formData.append('aplicacionId', this.settings.getAppId());
    formData.append('aplicacionVersion', this.settings.APP_VERSION);
    formData.append('nombre', data.nombre);
    formData.append('comercioEmail', data.comercioEmail);
    formData.append('comercioTelefono', data.comercioTelefono);
    formData.append('comercioTipoId', data.comercioTipoId);
    formData.append('web', data.web);
    formData.append('facebook', data.facebook);
    formData.append('instagram', data.instagram);
    formData.append('twitter', data.twitter);
    formData.append('ruc', data.ruc);
    formData.append('logo', logo);

    // persona
    formData.append('usuario', data.usuario);
    formData.append('telefono', data.telefono);
    formData.append('email', data.email);
    formData.append('fechaNacimiento', data.fechaNacimiento);
    formData.append('nombrePersona', data.nombrePersona);
    formData.append('apellidoPersona', data.apellidoPersona);
    formData.append('contrasenha', data.contrasenha);


    return this.http.post(`${this.settings.URL_BASE}fraccionate/comercio`, formData);

  }
}
