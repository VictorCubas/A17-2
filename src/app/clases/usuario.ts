
export class Usuario {
    id: number | any;
    username: string;
    password?: string;
    activo: boolean;
    email: string;
    fechaNacimiento: Date | any;
    fechaAlta: Date | any;
    rolId: number | any;
    rol?: string;
    nombre?: string;
    apellido?: string;
    // usuario_modificacion_id: any;

    constructor(id?: number, username?: string, password?: string, activo?: boolean,
        email?: string, fechaNacimiento?: Date, fechaAlta?: Date, rolId?: number, rol?: string, nombre?: string, apellido?: string) {
        this.id = id ?? null;
        this.username = username ?? '';
        this.password = password ?? '';
        this.activo = activo ?? false;
        this.email = email ?? '';
        this.fechaNacimiento = fechaNacimiento ?? null;
        this.fechaAlta = fechaAlta ?? null;
        this.rolId = rolId ?? null;
        this.rol = rol ?? '';
        this.nombre = nombre ?? '';
        this.apellido = apellido ?? '';

        // this.usuario_modificacion_id = usuario_modificacion_id ?? null;
    }
}