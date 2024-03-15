/* eslint-disable @typescript-eslint/member-ordering */
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {AbstractControl, FormGroup} from '@angular/forms';
import {MyErrorStateMatcher} from '../my-error-state-macher';
import {Directive, OnInit} from '@angular/core';

// import {LectorPermisos} from '../../_guards/lector-permisos';
import {DialogSuccessComponent} from '../../shared-comercio/components/dialog-succes/dialog-success.component';
import {MetodosServicio} from '../interfaces/metodos-servicio';
import {DialogErrorComponent} from '../../shared-comercio/components/dialog-error/dialog-error.component';
import { NotificacionesService } from 'app/shared-comercio/services/notificaciones.service';

/**
 * Clase abstracta con todos los métodos básicos de un formulario.
 *
 * @author Marcos Ortega <maortega@fctunca.edu.py>
 */
@Directive()
export abstract class Formularios<T> implements OnInit {
  // get lectorPermisos(): LectorPermisos {
  //     return this._lectorPermisos;
  // }
  //
  // set lectorPermisos(value: LectorPermisos) {
  //     this._lectorPermisos = value;
  // }
  /**
   * Abm determina si el formulario está siendo utilizado para agregar o modificar datos, es false cuando se utiliza
   * para ver.
   *
   * @private
   */
  private _abm: boolean = false;
  /**
   * Dis o disable es el parámetro que se pasa a los formControl en su creación para dejarsos disable o no, son true
   * para el ver.
   *
   * @private
   */
  private _dis: boolean = true;
  /**
   * Indica si es que se accedió o no a la ruta hijo editar de un componente.
   *
   * @private
   */
  private _editar: boolean = false;
  private _macherError!: MyErrorStateMatcher;
  /**
   * Es true mientras un valor haya sido enviado al back y se espere la respuesta del servicio, esto evita que un mismo
   * botón sea presionado más de una vez enviando el mismo valor al mismo servicio mientras todavía no se cuente con la
   * respuesta de la primera interacción
   *
   * @private
   */
  private _submitted: boolean = false;
  /**
   * Valor del registro sobre el cual se está trabajando en el formulario.
   *
   * @private
   */
  private _item!: T;
  /**
   * FormGruop abstracto del formulario actual.
   *
   * @private
   */
  private _formularioAbs!: FormGroup;

  // private _lectorPermisos: LectorPermisos;

  protected constructor(
    public router: Router,
    public matDialog: MatDialog,
    public rutaPadre: string,
    public service: MetodosServicio<T>,
    protected notificacionesService: NotificacionesService
  ) {
    // this.lectorPermisos = new LectorPermisos(matDialog);
  }

  /**
   * Define los valores para las variables abm y dis dependiendo de cuál sea la ruta hijo a la que se navegó.
   */
  ngOnInit(): void {
    if (this.router.url === ('/' + this.rutaPadre + '/registrar') || this.router.url === ('/' + this.rutaPadre + '/modificar')) {
      this.abm = true;
      this.dis = false;
    }
    this.construirFormGroup();
    if (this.router.url === '/' + this.rutaPadre + '/registrar') {
    }
    if (this.router.url === '/' + this.rutaPadre + '/modificar' || this.router.url === '/' + this.rutaPadre + '/ver') {
      this.editar = true;
    }

  }

  /**
   * Dependiendo del valor de editar, guarda o actualiza el valor del formulario, en caso que el procedimiento sea
   * guardar el campo id es eliminado de la operación.s
   */
  guardar(): void {
    this.submitted = true;
    if (!this.formularioAbs.valid) {
      // this.formularioAbs.markAsDirty();
      // this.formularioAbs.markAsDirty();
      this.submitted = false;
      return;
    }
    this.item = this.formularioAbs.value;
    if (this.editar) {
      this.service.update(this.item).subscribe(
        () => {
          this.notificacionesService.success('Datos Gaurdados.');
          this.router.navigate([`/${this.rutaPadre}`]).then(() => null);
        },
        () => this.submitted = false,
        () => this.submitted = false
      );
    } else {
      // delete this.item?.id;
      this.service.save(this.item).subscribe(
        () => {
          this.formularioAbs = this.construirFormGroup();
          this.notificacionesService.success('Datos Gaurdados.');
        },
        () => this.submitted = false,
        () => this.submitted = false
      );
    }
  }

  /**
   * Regresa a la ruta padre.
   */
  cancelar(): void {
    this.router.navigate([`/${this.rutaPadre}`]).then(() => null);
  }

  /**
   * Elimina un registro.
   *
   * @param item a ser eliminado
   */
  eliminar(item: any): void {

    // if (!this.lectorPermisos.permisosBotones('eliminar', true, this.rutaPadre)) {
    //     return;
    // }
    const data = {
      titulo: 'Atención',
      menssagejeError: 'Está seguro de eliminar el registro?',
      // esta variable es true cuando deben aparecer los botones aceptar y cancelar en el dialogo
      textoBtnAceptar: 'Aceptar',
      textoBtnCerrar: 'Cancelar',
      aceptarCancelar: true
    };
    const errorDialog = this.matDialog.open(DialogErrorComponent, {data, disableClose: true});
    errorDialog.afterClosed().subscribe((result) => {
      if (result === 'aceptar') {
        this.service.delId(item.id).subscribe(() => {
          this.notificacionesService.success('Elimnado con exito.');
          this.cancelar();
        });
      }
    });
  }

  /**
   * Función a ser construída en cada hijo. Debe contener el formgrup de cada abm
   *
   * @example
   * return this.fb.group({
   *            id: [null],
   *            nombre: [{value: '', disabled: super.dis}, Validators.required],
   *            entidad_codigo: [{value: '', disabled: super.dis}],
   *            departamento: [new Departamento()]
   * });
   */
  abstract construirFormGroup(): FormGroup;

  /**
   * Dialogo utilizado para los warning.
   *
   * @param title Título a ser mostrado en el dialog.
   * @param message Mensaje principal del dialog.
   * @param callBack
   */
  dialogError(title: string, message: string, callBack?: any): void {
    const data = {
      titulo: title,
      menssagejeError: message,
    };
    const errorDialog = this.matDialog.open(DialogErrorComponent, {data, disableClose: true});
    errorDialog.afterClosed().subscribe((result: any) => callBack ? callBack(result) : null);
  }

  dialogSucces(title: string, message: string, callBack?: any): void {
    const data = {
      title,
      menssageSucces: message,
      // panelClass: 'custom-modalbox'
    };
    const modalSuccess = this.matDialog.open(DialogSuccessComponent, {data});
    modalSuccess.afterClosed().subscribe((result: any) => callBack ? callBack(result) : null);
  }


  get abm(): boolean {
    return this._abm;
  }

  set abm(value: boolean) {
    this._abm = value;
  }

  get dis(): boolean {
    return this._dis;
  }

  set dis(value: boolean) {
    this._dis = value;
  }

  get editar(): boolean {
    return this._editar;
  }

  set editar(value: boolean) {
    this._editar = value;
  }

  get macherError(): MyErrorStateMatcher {
    return this._macherError;
  }

  set macherError(value: MyErrorStateMatcher) {
    this._macherError = value;
  }

  get submitted(): boolean {
    return this._submitted;
  }

  set submitted(value: boolean) {
    this._submitted = value;
  }


  get item(): T {
    return this._item;
  }

  set item(value: T) {
    this._item = value;
  }


  get formularioAbs(): FormGroup {
    return this._formularioAbs;
  }

  set formularioAbs(value: FormGroup) {
    this._formularioAbs = value;
  }

  /**
   * Recupera los controles del formGroup.
   *
   * @example
   * this.f.nombre.value
   * Donde nombre es un control del formGroup
   */
  get f(): { [p: string]: AbstractControl } {
    return this.formularioAbs.controls;
  }
}
