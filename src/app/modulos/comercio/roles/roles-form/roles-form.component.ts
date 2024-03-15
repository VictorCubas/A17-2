import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { PageHeaderData } from 'app/shared-comercio/components/forms-header/page-header-data';
import { PageHeaderDataService } from 'app/shared-comercio/services/page-header-data.service';
import { Formularios } from 'app/_helpers/clases/formularios';
import { Rol } from 'app/clases/rol';
import { RolesService } from '../roles.service';
import { NotificacionesService } from 'app/shared-comercio/services/notificaciones.service';
import { RolPermisoMenu } from 'app/clases/rol-permiso-menu';

@Component({
  selector: 'app-roles-form',
  templateUrl: './roles-form.component.html',
  styleUrls: ['./roles-form.component.scss']
})
export class RolesFormComponent extends Formularios<Rol> implements OnInit {

  @ViewChild('stepper', { static: false }) private stepper!: MatStepper;
  rolPermisoMenu: RolPermisoMenu = new RolPermisoMenu();
  edit!: boolean;

  constructor(
    public router: Router,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public notificacionService: NotificacionesService,
    public override service: RolesService,
    // public moduloService: ModuloService,
    private headerDataService: PageHeaderDataService
  ) {
    super(router, dialog, 'procesadora/roles', service, notificacionService);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.edit = super.editar;
    super.formularioAbs = this.construirFormGroup();
    if (super.editar) {
      super.formularioAbs.setValue(this.service.getItem());
      this.rolPermisoMenu.rol = this.service.getItem();
    } else {
      this.service.restartItem();
    }
    this.headerDataService.setHeaderData(new PageHeaderData('Roles', this.rutaPadre, true));
  }


  construirFormGroup(): FormGroup {
    return this.fb.group({
      id: [null],
      nombre: [{value: '', disabled: super.dis}, Validators.required],
      descripcion: [{value: '', disabled: super.dis}, Validators.required],
      //modulo_id: [{value: '', disabled: super.dis}, Validators.required],
      modulo: [{ value: '', disabled: super.dis }, Validators.required],
    });
  }

  getErrorMessage(cName: string): string | void {
    if (this.formularioAbs.controls[cName].hasError('required')) {
      return 'Campo requerido';
    }
  }

  /**
   * Método para guardar un rol
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
    if (this.editar) {
      this.service.update(super.item).subscribe(
        () => {
          this.notificacionesService.success('Datos Gaurdados.');
          this.router.navigate([`/${this.rutaPadre}`]);
        },
        () => this.submitted = false,
        () => this.submitted = false
      );
    } else {
      this.service.save(super.item).subscribe(
        (res: any) => {
          this.notificacionesService.success('Datos Gaurdados.');
          super.item.id = res.id;
          this.rolPermisoMenu.rol = super.item;
          this.stepper.next();
        },
        () => this.submitted = false,
        () => this.submitted = false,
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
}
