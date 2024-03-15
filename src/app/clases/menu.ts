import {Modulo} from './modulo';

export class Menu {

  id: number;
  nombre: string;
  secuencia: number;
  url: string;
  menu_padre: any;
  visible: boolean;
  modulo: Modulo;
  icono: string;

  constructor(
    id?: number, nombre?: string, secuencia?: number, url?: string, menu_padre?: Menu,
    visible?: boolean, modulo?: Modulo, icono?: string) {
    this.id = id ?? 0;
    this.nombre = nombre ?? '';
    this.secuencia = secuencia ?? 0;
    this.url = url ?? '';
    this.menu_padre = menu_padre ?? {id: null};
    this.visible = visible ?? false;
    this.modulo = modulo ?? new Modulo();
    this.icono = icono ?? '';
  }

}
