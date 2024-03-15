import {Barrio} from "./barrio";

export class ComercioSucursal {
  id: number;
  nombre: string;
  calle1: string;
  calle2: string;
  calle3: string;
  numero: string;
  edificio: string;
  piso: string;
  descripcion: string;
  departamento: string;
  latitud: string;
  longitud: string;
  matriz: string;
  nro_sucursal: string;
  cod_sucursal: string;
  //comercio: Comercio;
  barrio: Barrio;


  constructor(id?: number, nombre?: string, calle1?: string, calle2?: string, calle3?: string, numero?: string, edificio?: string, piso?: string, descripcion?: string, departamento?: string, latitud?: string, longitud?: string, matriz?: string, nro_sucursal?: string, cod_sucursal?: string, barrio?: Barrio) {
    this.id = id ?? 0;
    this.nombre = nombre ?? '';
    this.calle1 = calle1 ?? '';
    this.calle2 = calle2 ?? '';
    this.calle3 = calle3 ?? '';
    this.numero = numero ?? '';
    this.edificio = edificio ?? '';
    this.piso = piso ?? '';
    this.descripcion = descripcion ?? '';
    this.departamento = departamento ?? '';
    this.latitud = latitud ?? '';
    this.longitud = longitud ?? '';
    this.matriz = matriz ?? '';
    this.nro_sucursal = nro_sucursal ?? '';
    this.cod_sucursal = cod_sucursal ?? '';
    //this.comercio = comercio ?? new Comercio();
    this.barrio = barrio ?? new Barrio();
  }
}
