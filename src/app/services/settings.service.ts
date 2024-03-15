import {Injectable} from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  // URL base para la comunicacion de servicios
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public URL_BASE = environment.apiUrl;

  // nombre de la app
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public APP_NAME = 'Credi Agil';

  // identificador de la app
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public APP_ID = environment.appId;

  // version de la app
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public APP_VERSION = '1.0.0';

  getAppId(): string {
    return this.APP_ID;
  }
}
