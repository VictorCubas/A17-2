/* tslint:disable:variable-name */
import {Ciudad} from './ciudad';

export class Barrio {

  id: number;
  nombre: string;
  entidad_codigo: number;
  ciudad: Ciudad;


  constructor(id?: number, nombre?: string, entidad_codigo?: number, ciudad?: Ciudad) {
    this.id = id ?? 0;
    this.nombre = nombre ?? '';
    this.entidad_codigo = entidad_codigo ?? 0;
    this.ciudad = ciudad ?? new Ciudad();
  }
}
