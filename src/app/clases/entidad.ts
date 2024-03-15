import {EntidadTipo} from './entidad-tipo';

/* tslint:disable:variable-name */
export class Entidad {
  id: number;
  nombre_fantasia: string;
  path_logo: string;
  casa_matriz: string;
  ws_codigo: string;
  entidad_tipo: EntidadTipo;

  constructor(id?: number, nombre_fantasia?: string, path_logo?: string, casa_matriz?: string, ws_codigo?: string,
              entidad_tipo?: EntidadTipo) {
    this.id = id ?? null;
    this.nombre_fantasia = nombre_fantasia ?? '';
    this.path_logo = path_logo ?? '';
    this.casa_matriz = casa_matriz ?? '';
    this.ws_codigo = ws_codigo ?? '';
    this.entidad_tipo = entidad_tipo ?? new EntidadTipo();
  }
}
