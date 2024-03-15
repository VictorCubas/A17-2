import {Aplicacion} from "./aplicacion";

export class RegistroUsuario {
  id: number;
  username: string;
  password: string;
  activo: boolean;
  email: string;
  fecha_nacimiento: Date;
  aplicacion: Aplicacion;
  usuario_modificacion_id: any;

  constructor(id?: number, username?: string, password?: string, activo?: boolean,
              email?: string, fecha_nacimiento?: Date, aplicacion?: Aplicacion, usuario_modificacion_id?: any) {
    this.id = id ?? null;
    this.username = username ?? '';
    this.password = password ?? '';
    this.activo = activo ?? false;
    this.email = email ?? '';
    this.fecha_nacimiento = fecha_nacimiento ?? null;
    this.aplicacion = aplicacion ?? new Aplicacion;
    this.usuario_modificacion_id = usuario_modificacion_id ?? null;
  }
}
