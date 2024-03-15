export class Permiso {
    id: number;
    nombre: string;
    descripcion: string;
    requerido: boolean;

    constructor(id?: number, nombre?: string, descripcion?: string, requerido?: boolean) {
        this.id = id ?? 0;
        this.nombre = nombre ?? '';
        this.descripcion = descripcion ?? '';
        this.requerido = requerido ?? true;
    }

}
