
export class Modulo {
  id: number | any;
  nombre: string;
  key: string | any;
  descripcion: string | any;

  constructor(id?: number, nombre?: string, key?: string, descripcion?: string) {
    this.id = id ?? null;
    this.nombre = nombre ?? '';
    key = key ?? '';
    descripcion = descripcion ?? '';
  }
}
