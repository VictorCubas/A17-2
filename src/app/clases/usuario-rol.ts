import { Rol } from './rol';

export class UsuarioRol {
    id: number | any;
    usuario_id: number | any;
    rol: Rol;

    constructor(id?: number, usuario_id?: number, rol?: Rol) {
        this.id = id ?? null;
        this.usuario_id = usuario_id ?? null;
        this.rol = rol ?? new Rol();
    }
}