import { Menu } from "./menu";
import { Permiso } from "./permiso";

export class MenuPermiso {

    id: number | any;
    menu: Menu;
    permiso: Permiso;

    constructor(id?: number, menu?: Menu, permiso?: Permiso)
    {
        this.id = id ?? null;
        this.menu = menu ?? new Menu();
        this.permiso = permiso ?? new Permiso();
    }

}