/* tslint:disable:variable-name */
export class AplicacionTipo {
  id: number;
  nombre: string;
  descripcion: string;

  constructor(id?: number, nombre?: string ) {
    this.id = id ?? null;
    this.nombre = nombre ?? '';


  }
}
