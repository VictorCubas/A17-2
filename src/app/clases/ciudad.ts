import {Departamento} from "./departamento";


export class Ciudad {
  id: number;
  nombre: string;
  entidad_codigo: string | undefined;
  departamento: Departamento | undefined;

  constructor(id?: number, nombre?: string, entidad_codigo?: string, departamento?: Departamento) {
    this.id = id ?? 0;
    this.nombre = nombre ?? '';
    this.entidad_codigo = entidad_codigo ?? '';
    this.departamento = departamento ?? new Departamento();
  }
}
