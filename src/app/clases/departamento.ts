import { Pais } from './pais';

/* tslint:disable:variable-name */
export class Departamento {
  id: number;
  nombre: string;
  pais: Pais;


  constructor(id?: number, nombre?: string, pais?: Pais) {
    this.id = id ?? 0;
    this.nombre = nombre ?? '';
    this.pais = pais ?? new Pais();
  }
}
