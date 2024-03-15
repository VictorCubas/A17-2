import { MenuPermiso } from './menu-permiso';
import { Rol } from "./rol";

export class RolPermisoMenu {

    id: number | any;
    rol : Rol;
    menu_permiso: MenuPermiso;

    constructor(id?: number, rol?: Rol, menu_permiso?: MenuPermiso)
    {
        this.id = id ?? null;
        this.rol = rol ?? new Rol();
        this.menu_permiso = menu_permiso ?? new MenuPermiso();
    }
}