/* tslint:disable:variable-name */
import {Entidad} from './entidad';
import {AplicacionTipo} from './aplicacion-tipo';
import { environment } from 'src/environments/environment';

export class Aplicacion {
  id: number;
  nombre: string;
  app_id: string;
  verificacion_automatica: boolean;
  entidad: Entidad;
  aplicacion_tipo: AplicacionTipo;


  constructor(id?: number, nombre?: string, app_id?: string, verificacion_automatica?: boolean, entidad?: Entidad,
              aplicacion_tipo?: AplicacionTipo) {
    this.id = id ?? null;
    this.nombre = nombre ?? null;
    this.app_id = app_id ?? environment.appId;
    this.verificacion_automatica = verificacion_automatica ?? null;
    this.entidad = entidad ?? null;
    this.aplicacion_tipo = aplicacion_tipo ?? null;
  }
}
