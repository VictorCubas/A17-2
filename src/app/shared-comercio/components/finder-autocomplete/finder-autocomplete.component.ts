/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
/* tslint:disable:variable-name no-string-literal */

import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {debounceTime, map, switchMap} from 'rxjs/operators';
import {MyErrorStateMatcher} from '../../../_helpers/my-error-state-macher';
import * as NestedProperty from 'nested-property';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MetodosServicio} from '../../../_helpers/interfaces/metodos-servicio';
import { BasicResponse } from 'app/_helpers/clases/basic-response';

/**
 * Proporciona un campo input con autocompletado que despliega un select
 *
 * @author Marcos Ortega <maortega@fctunca.edu.py>
 * @example
 * <app-finder-autocomplete [dis]="dis" [columna]="['id']" [item]="f.comision_parametro.value"
 * [service]="comisionParametroService"
 * placeHolder="Comision Parametro"
 * (output)="f.comision_parametro.setValue($event);"></app-finder-autocomplete>
 */
@Component({
  selector: 'app-finder-autocomplete',
  templateUrl: './finder-autocomplete.component.html',
  styleUrls: ['./finder-autocomplete.component.scss']
})

export class FinderAutocompleteComponent<T> implements OnInit, OnChanges {
  /**
   * Manejador de errores
   */
  macherError: MyErrorStateMatcher = new MyErrorStateMatcher();
  /**
   * En caso de estar utilizando el buscador en modo de edición, aquí se recupera el valor que actualmente está siendo almacenado en la
   * base de datos para poder posicionar el buscador en el registro correcto.
   */
  @Input() item!: T | any;
  /**
   * Determina si es que el buscador hará la función de child o no (la función child hace referencia a que el buscador
   * actual depende del resultado de otro buscador)
   */
  @Input() childFunction = false;
  /**
   * Valor del id recibido encaso que el selector actual tenga una dependencia padre hijo con otro selector, ej: País,
   * departamento, donde el selector dependiente al que se le enviaría el id del padre es departamento.
   */
  @Input() parentId!: number;
  /**
   * Nombre correspondiente al parent actual
   *
   * @example
   * El padre de Departamento sería país, de la siguiente forma:
   * [parentName] = 'pais'
   */
  @Input() parentName!: string;
  /**
   * Nombre correspondiente al child actual
   *
   * @example
   * El child de país sería departamento, de la siguiente forma:
   * [childName = 'child'
   */
  @Input() childName!: string;
  /**
   * Servicio con el cual se procederá a realizar la busqueda
   */
  @Input() service!: MetodosServicio<T>;
  /**
   * Placeholder del input de búsqueda.
   */
  @Input() placeHolder = 'Texto';
  /**
   * Columna del objeto en la cuál se realizará la busqueda.
   */
  @Input() columna: string | Array<string> = 'nombre';
  /**
   * En caso que se quiera hacer una búsqueda dentro de un campo anidado example: empresa_sucursal__nombre, empresa_sucursal es una
   * tabla y __nombre es un campo suyo
   */
  @Input() campoAnidado!: string;
  /**
   * Buscar por un campo prefijo anidado, cuando hay más de un nivel en el json
   */
  @Input() campoAnidadoFilter!: string;
  /**
   * Es la divisoria utilizada dentro del resultado, por defecto es un espacio
   */
  @Input() joinChart = ' ';
  /**
   * Propiedad disable del input
   */
  @Input() dis!: boolean;
  /**
   * Reciben eventos de los componentes padres donde este componente sea utilizado
   */
  @Input() events!: Observable<string>;
  /**
   * Es true en caso que se desee mostrar un botón de agregar, el cual solo funcionará para detonar un eventEmitter, el botón agregar está
   * pensado para los casos en los cuales se desee agregar registros a una lista directamente desde el buscador, al presionar el botón
   * solo hay que limpiar el campo correspondiente al buscador ya que los valores del buscador ya son retornados al componente padre en su
   * correspondiente eventEmitter.
   */
  @Input() btnAgregar = false;
  /**
   * submit del botón agregar
   */
  @Input() submit = false;
  /**
   * Texto para mostrar en el toolTip botón de agregar
   */
  @Input() agregarToolTipText = 'Agregar';
  /**
   * Emite un evento al precionar el botón agregar
   */
  @Output() agregarEmitter: EventEmitter<void|any> | any = new EventEmitter<void>();
  /**
   * Se suscribe a los eventos que puedan llegar en guardarObs, en caso de llegar alguno ejecuta acciones en este componente.
   */
  eventsSubscription!: Subscription;
  /**
   * Form control del campo buscador.
   */
  formulario!: FormControl;
  /**￼
   * Autocomplete
   * Suggests relevant options as the user types.
   * ￼
   * Badge
   * A small value indicator that can be overlaid on another object.
   * ￼
   * Bottom Sheet
   * A large interactive panel primarily for mobile devices.
   *
   * filtro del buscador, el cuál consuta la base de datos.
   */
  filtro!: Observable<Array<T>> | any;
  inicio = true;
  /**
   * Emitter del valor seleccionado.
   */
  @Output() output: EventEmitter<T> = new EventEmitter<T>();
  /**
   * True en caso que el autocomplete deba ocultarse
   */
  _hideAutocomplete = false;
  /**
   * True en caso que el autocomplete deba ocultarse
   */
  @Input() hideAutocomplete = false;
  /**
   * Estilo del mat-form-field del campo buscador
   */
  @Input() styleInput = 'standard'; // 'standard' | 'outline'
  /**
   * Verifica si el input debe ser un inputa requerido.
   *
   * @example
   * [esRequerido] = false
   */
  @Input() esRequerido = true;

  itemSelected!: MatAutocompleteSelectedEvent | any; // save the las item selected.

  constructor() {
  }

  /**
   * Setea el elemento en el buscador cuando se envía un dato o lo reinicia de ser necesario.
   */
  ngOnChanges(changes: SimpleChanges): void {
    try {
      if (changes['item'].previousValue) {
        if (!changes['item'].currentValue) {
          this.formulario.reset();
        }
      }
      if (changes['item'].currentValue) {
        this.formulario.setValue(this.item);
      }
      if (changes['dis'].currentValue) {
        this.ngOnInit();
      }
    } catch (e) {

    }

    try {
      if ((changes['parentId'].currentValue && this.childFunction) || (this.parentId === null && this.childFunction)) {
        this.reiniciar();
        this.filtro = this.buscador('');
      }
    } catch (e) {

    }
  }

  /**
   * 1 Detona el required del buscador en caso que haya sido enviado un evento, el mismo detona el error required en
   * caso que el campo de búsqueda no haya sido llenado.
   *
   * 2 Crea el formcontrol del buscador
   *
   * 3 Setea el del buscador enviado por el input en un componente de edición
   *
   * 4 Limpia el filtro del buscador.
   *
   * 5 Setea el valor del place holder.
   *
   * 6 Asigna el this._hideAutocomplete enviado para ocultar o mostrar el autocomplete.
   */
  ngOnInit(): void {
    // 1
    this.eventsSubscription = this.events?.subscribe((res) => {
      if (res === 'finderTouched') {
        this.detonarError();
      }
      if (res === 'clearFinder') {
        this.reiniciar();
      }
    });
    // 2
    // const validaciones = this.esRequerido ? Validators.required : [];
    // his.formulario = new FormControl({value: '', disabled: this.dis}, validaciones);
    if (this.esRequerido) {
      this.formulario = new FormControl({value: '', disabled: this.dis}, Validators.required);
    } else {
      this.formulario = new FormControl({value: '', disabled: this.dis});
    }
    // 3
    if (this.item) {
      if (this.item['id'] > 0) {
        this.formulario.setValue(this.item);
      }
    }
    // 4
    if (!this.childFunction || (this.childFunction && this.parentId > 0)) {
      this.filtro = this.buscador('');
    }
    // 6
    this._hideAutocomplete = this.hideAutocomplete;
  }

  /**
   * Teniendo el objeto seleccionado como valor del buscador, muestra en el front el valor de la propiedad seleccionada por medio del
   * parámetro this.columna
   */
  displayFn = (subject: any): any => {
    if (subject === null) {
      return '';
    }
    if (Array.isArray(this.columna)) {
      const _subject: any = [];
      this.columna.forEach((colum: string) => {
        if (colum.includes('.')) {
          _subject.push(this.getColumText(subject, colum));
        } else {
          if (subject[colum] !== undefined) {
            _subject.push(this.getColumText(subject, colum));
          }
        }
      });
      const _subject_return = _subject.length > 1 ? _subject.join(this.joinChart) : _subject[0];
      return typeof _subject_return === 'string' ? _subject_return.trim() : _subject_return;
    } else {
      return typeof this.getColumText(subject, this.columna) === 'string' ?
        this.getColumText(subject, this.columna).trim() : this.getColumText(subject, this.columna);
    }
  };

  /**
   * Verifica si la propiedad viene con un punto para sacar con este propoerty el valor
   */
  getColumText(subject: any, columna: string): any {
    if (columna.includes('.')) {
      return NestedProperty.get(subject, columna);
    } else {
      return subject[columna] !== undefined ? subject[columna] : '';
    }
  }

  /**
   * Ejecuta this.output para enviar los datos del objeto seleccinado al componente padre.
   */
  onClose(): void {
    if (this.formulario.value !== '' && this.formulario.value !== null) {
      this.formulario.setValue(this.itemSelected.option.value);
    }
    this.output.emit(this.formulario.value);
  }

  onSelected(item: MatAutocompleteSelectedEvent): void {
    this.itemSelected = item;
    this.onClose();
  }

  /**
   * Activae el filtro de busqueda
   */
  activarFiltro(): void {
    this._hideAutocomplete = this.hideAutocomplete ? this.formulario.value.length === 0 : false;
    if (this.inicio) {
      this.filtro = this.formulario.valueChanges
        .pipe(
          debounceTime(300),
          switchMap((value: any): any => this.buscador(value))
        );
      this.inicio = false;
    }
    if (this.esRequerido) {
      if (!this.formulario.value?.id) {
        this.formulario.setErrors({incorrect: true});
      } else {
        this.formulario.setErrors(null);
      }
    }

    if (this.formulario.value === '') {
      this.output.emit();
    }
  }

  /**
   * Realiza la busqueda en la base de datos.
   */
  buscador(filtro: string): Observable<any> {
    let column = Array.isArray(this.columna) ? this.columna[0] : this.columna;
    column = column.includes('.') ? column.split('.')[0] + '_id' : column;
    // busqueda de campo dependiente (Pais, Departamento)
    if (this.parentId > 0) {
      return this.service.getListByNameAndParentId(this.parentName, this.childName, this.parentId, column, filtro)
        .pipe(map((res: BasicResponse<T[]>) => res.data));
    }
    if (this.campoAnidado) {
      return this.service.getAllByCampo(filtro, '30', '0', 'ASC', column, this.campoAnidado, this.campoAnidadoFilter ?? filtro).pipe(
        map((res: BasicResponse<T[]>) => res.data));
    } else {
      return this.service.getAll(filtro, '30', '0', 'ASC', column).pipe(
        map((res: BasicResponse<T[]>) => res.data)
      );
    }
  }

  /**
   * Simula una interacción con el input, para que sus errores sean detonados en caso de no ser rellenado este campo en el formularioPago.
   */
  private detonarError(): void {
    if (this.esRequerido) {
      this.formulario.markAsDirty();
      this.formulario.markAsTouched();
    }
  }

  /**
   * Emite un evento al pulsar el botón agregar y reinicia el input
   */
  agregar(): void {
    this.submit = true;
    this.agregarEmitter.emit();
  }

  /**
   * Reninicia el formcontrol, para poder limpiar el buscador de resutlados anteriores
   */
  reiniciar(): void {
    this.submit = false;
    if (this.esRequerido) {
      this.formulario = new FormControl({value: '', disabled: this.dis}, Validators.required);
    } else {
      this.formulario = new FormControl({value: '', disabled: this.dis});
    }
    this.itemSelected = null;
    this.inicio = true;
  }
}
