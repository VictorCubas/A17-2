import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { Usuario } from 'app/clases/usuario';
import { UsuarioRol } from 'app/clases/usuario-rol';
import { SettingsService } from 'app/services/settings.service';
import { PageHeaderData } from 'app/shared-comercio/components/forms-header/page-header-data';
import { NotificacionesService } from 'app/shared-comercio/services/notificaciones.service';
import { PageHeaderDataService } from 'app/shared-comercio/services/page-header-data.service';
import { Formularios } from 'app/_helpers/clases/formularios';
import { Subject, takeUntil } from 'rxjs';

import { RolesService } from '../../roles/roles.service';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: [],
})
export class UsuarioFormComponent
  extends Formularios<Usuario>
  implements OnInit
{
  @ViewChild('stepper', { static: false }) private stepper!: MatStepper;
  hidePass: boolean = false;
  usuarioRol: UsuarioRol = new UsuarioRol();
  edit!: boolean;

  rolEdit: any = null;
  rolList: Array<any> = [];
  unsubscribe$: Subject<any> = new Subject();
  constructor(
    public override router: Router,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public notificacionService: NotificacionesService,
    public override service: UsuarioService,
    private headerDataService: PageHeaderDataService,
    private settings: SettingsService,
  ) {
    super(router, dialog, 'comercio/usuario', service, notificacionService);
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.getRoles();

    this.edit = super.editar;
    super.formularioAbs = this.construirFormGroup();
    if (super.editar) {
      const item = this.service.getItem();
      console.log(item);
      this.rolEdit = {
        rolId: item.rolId,
        rol: item.rol,
        id: item.rolId,
      };

      this.usuarioRol.id = this.rolEdit.rolId;
      this.usuarioRol.usuario_id = item.id;

      delete item['rol'];
      delete item['fechaAlta']; // removemos el atributo fecha alta, pendiente de prueba
      if (item) {
        delete item.password;
      }
      super.formularioAbs.setValue(item);
      // this.usuarioRol.usuario_id = item.id;
    } else {
      this.service.restartItem();
    }
    this.headerDataService.setHeaderData(
      new PageHeaderData(this.editar ? 'Editar Usuario' : 'Usuario', this.rutaPadre, true)
    );
  }

  getRoles(): any {
    this.service.obtenerRol({}).pipe(takeUntil(this.unsubscribe$)).subscribe( (resp: any) => {
      console.log(resp);
      this.rolList = resp;

      // if (this.edit) {

      //   const index = this.rolList.findIndex( e => e.id === this.item.rolId);

      //   if (index > -1) {
      //     this.f['rolId'].setValue(this.rolList[index].id);
      //   }

      // } else {
      //   this.f['rolId'].setValue(this.rolList[0].id);
      // }

    });
  }

  construirFormGroup(): FormGroup {
    const form = this.fb.group({
      id: [null],
      username: [{ value: '', disabled: super.dis }, Validators.required],
      email: [{ value: '', disabled: super.dis }, Validators.required],
      fechaNacimiento: [
        { value: '', disabled: super.dis },
        Validators.required,
      ],
      rolId: [{ value: '', disabled: super.dis }, Validators.required],
      activo: [{ value: false, disabled: super.dis }],
      nombre: [{ value: '', disabled: super.dis }, Validators.required],
      apellido: [{ value: '', disabled: super.dis }, Validators.required],
    });

    if (!this.edit) {
      // form.addControl('password', new FormControl('', Validators.required));
    }

    return form;
  }

  // siguiente() {
  //   this.stepper.next();
  // }

  // setRolId(id: any) {
  //   console.log(id);
  //   this.usuarioRol.id = id;
  // }

  getErrorMessage(cName: string): string | any {
    if (this.formularioAbs.controls[cName].hasError('required')) {
      return 'Campo requerido';
    }
  }

  /**
   * Método para guardar un usuario
   *
   * @returns void
   */
  override guardar(): void {
    this.submitted = true;
    if (!this.formularioAbs.valid) {
      this.submitted = false;
      return;
    }

    this.item = this.formularioAbs.value;

    console.log(super.item);

    const date = new Date(super.item.fechaNacimiento);

    const data = super.item;

    // delete(data.id);
    data.fechaNacimiento = date.toISOString().split('T')[0];
    if (this.editar) {
      this.service.update(data).subscribe(
        () => {
          this.notificacionesService.success('Datos Gaurdados.');
          this.router.navigate([`/${this.rutaPadre}`]);
        },
        () => (this.submitted = false),
        () => (this.submitted = false)
      );
    } else {
      console.log(data);
      delete data.id;

      data.username = data.username.toString();

      this.service.save(data).subscribe(
        (res) => {
          this.notificacionesService.success('Datos Guardados.');
          console.log(res);
          this.cancelar();
        },
        () => (this.submitted = false),
        () => (this.submitted = false)
      );
    }
  }

  /**
   * Método de reseteo de valores por defecto
   */
  nuevo(): void {
    this.formularioAbs.reset();
    this.stepper.reset();
  }
  restaurarPassword(): void {
    // const dialog = this.dialog.open(PasswordRestaurarComponent, {
    //   maxHeight: 600,
    //   maxWidth: 600,
    //   data: {
    //     id: this.service.getItem().id,
    //     loginPage: true
    //   }
    // });
    // dialog.afterClosed();
  }
}
