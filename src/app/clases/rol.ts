import { Modulo } from './modulo';

export class Rol {
    id: number | any;
    nombre: string;
    descripcion: string;
    modulo_id: number | any;
    rol_padre_id: number | any;
    modulo: Modulo | any;

    constructor(id?: number, nombre?: string, descripcion?: string, modulo_id?: number, rol_padre_id?: number) {
        this.id = id ?? null;
        this.nombre = nombre ?? '';
        this.descripcion = descripcion ?? '';
        this.modulo_id = modulo_id ?? null;
        this.rol_padre_id = rol_padre_id ?? null;
    }

}