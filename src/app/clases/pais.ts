/* tslint:disable:variable-name */
export class Pais {
  id: number;
  nombre: string;
  abreviatura: string;
  iso_3166: string;
  prefijo_telefonico: string;
  path_bandera: string;
  nacionalidad: string;
  sequence: number;
  pais_activo: boolean;
  entidad_codigo: number;

  constructor(id?: number, nombre?: string, abreviatura?: string, iso_3166?: string, prefijo_telefonico?: string,
              path_bandera?: string, nacionalidad?: string, sequence?: number, pais_activo?: boolean,
              entidad_codigo?: number) {
    this.id = id ?? 0;
    this.nombre = nombre ?? '';
    this.abreviatura = abreviatura ?? '';
    this.iso_3166 = iso_3166 ?? '';
    this.prefijo_telefonico = prefijo_telefonico ?? '';
    this.path_bandera = path_bandera ?? '';
    this.nacionalidad = nacionalidad ?? '';
    this.sequence = sequence ?? 0;
    this.pais_activo = pais_activo ?? true;
    this.entidad_codigo = entidad_codigo ?? 0;
  }
}
