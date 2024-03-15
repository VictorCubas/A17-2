import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UsuarioRol } from 'app/clases/usuario-rol';
import { Listas } from 'app/_helpers/clases/listas';
import { RolesService } from '../../roles/roles.service';
import { UsuarioRolService } from '../usuario-rol.service';

@Component({
  selector: 'app-usuario-rol-list',
  templateUrl: './usuario-rol-list.component.html',
  styleUrls: ['./usuario-rol-list.component.scss'],
})
export class UsuarioRolListComponent extends Listas<UsuarioRol> implements OnInit {

  @Input() usuarioRol!: UsuarioRol;
  @Input() edit!: boolean;
  @Input() dis!: boolean;
  @Input() list: Array<UsuarioRol> | any = [];
  @Output() rolSeleccionado = new EventEmitter();
  checkList: Array<any> = [];
  filterAux: Array<any> = [];
  allComplete: boolean = false;
  form!: FormGroup;


  constructor(
    public override router: Router,
    public service: RolesService,
    public usuarioRolService: UsuarioRolService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    super(router, 'procesadora/usuario', usuarioRolService, dialog);
  }

  ngOnInit(): void {
    this.buildFilterForm();
    //trae todos los roles del sistema
    this.service.getList().subscribe((res: any) => {
      this.checkList = res;
      //si es una edición, recuperar todos los roles asociados al usuario específico
      if (this.edit) {
        // this.usuarioRolService.getAll(this.usuarioRol.id.toString())
        //   .subscribe(res => {
            // this.list = res;
            //si ya existen roles asociados al usuario
            console.log(this.list);
            if (this.list.length > 0) {
              //por cada registro se valida check en lista de roles
              this.checkList.forEach(element => {
                this.list.forEach((el: any) => {
                  if (element.id == el.id) {
                    // element.completed = true;
                    // element.id = el.id;
                    element['checked'] = true;
                  }
                });
              });
            }
          // });
      }
    });
  }

  /**
   * Formulario de control para buscador de rol por nombre
   */
  buildFilterForm() {
    this.form = this.fb.group({
      busquedaGlobal: [{value: '', disabled: this.dis}],
    });
  }

  /**
   *
   * @param flag indicador de asignación | desasignación true|false
   * @param item rol a ser asignado
   * @param usuarioRolId identificador de la relación a ser eliminada
   */
  change(flag: boolean, item: any, usuarioRolId: any) {
    console.log(flag, item, usuarioRolId);
    this.rolSeleccionado.emit(usuarioRolId);

    return;

    this.usuarioRol.id = usuarioRolId;
    if (!flag) {
      this.usuarioRolService.delId(this.usuarioRol.id).subscribe(
        () => null
      );
    } else {
      this.usuarioRol.rol = item;
      this.usuarioRolService.save(this.usuarioRol).subscribe(
        (data) => {
          item.usuario_rol_id = data.id;
        }
      );
    }
  }

  /**
   * Método para realizar la búsqueda por nombre de rol
   */
  search() {
    let value = this.form.controls["busquedaGlobal"].value;
    if (this.filterAux.length > 0) {
      this.checkList = this.filterAux;
    }
    if (value != undefined && value != '') {
      this.filterAux = this.checkList;
      this.checkList = this.checkList.filter((e) => e.nombre.toUpperCase().includes(value.toUpperCase()));
    } else {
      this.checkList = this.filterAux;
    }
  }
}
