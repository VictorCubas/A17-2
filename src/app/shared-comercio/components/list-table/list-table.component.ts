/* eslint-disable arrow-parens */
/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable quote-props */
/* tslint:disable:variable-name */
import {
  Component,
  Input,
  Output,
  OnInit,
  ViewChild,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {DialogErrorComponent} from '../dialog-error/dialog-error.component';
import {MatDialog} from '@angular/material/dialog';
import * as NestedProperty from 'nested-property';
import {Observable} from 'rxjs';
import {OptionTableCell} from '../list-table-row-cell/list-table-row-cell.component';
import {animate, sequence, style, transition, trigger} from '@angular/animations';
import {MetodosServicio} from '../../../_helpers/interfaces/metodos-servicio';

export class TableCol {
  name!: string;
  val!: string;
  nested?: string;
  sorteable?: boolean;
  cellOptions!: OptionTableCell; // aca indicamos como quermeos mostrar el dato. text | date | boolean | currency ...
  colSort?: string; // nombre de columna que se usa para el sorted, si no se pasa se usa el value
}

/**
 * Muestra en una tabla los datos que estan en un array.
 * Example usage:
 *
 * ```typescript
 * <app-list-table [tableColumns]="[{name:'Código', val: 'id'},{name: 'Descripción', val: 'nombre'}]"
 * [tableData]="datosarray"
 * (editarEmitter)="editar($event)"
 * (verEmitter)="ver($event)">
 * @param tableColumns Array<object> Array de object para determinar las columnas, cada item es una
 * columna, con las propiedades minimas de name y val. donde name es el nombre de la columan haeder
 * que se motrara en la tabla, val es la propiedad del array de los rows de la tabla, opcional es
 * nested para determinar cuando un valor es una propiedad nested entre los row.
 * sorteable: deafult true, para hacer culomnas ordenables.
 *  example param:
 * ```
 *  [{name: 'Nombre 1', val: 'id'}, {name: 'columna nested', val: 'propiedad_n', nested:'a.b.1'}]
 * ```
 *
 * @author Martin Legal <martintmlg@gmail.com>
 */
@Component({
  selector: 'app-list-table',
  templateUrl: './list-table.component.html',
  styleUrls: ['./list-table.component.scss'],
  animations: [trigger('rowsAnimation', [
    transition('void => *', [
      style({height: '*', opacity: '0', transform: 'translateX(-550px)', 'box-shadow': 'none'}),
      sequence([
        animate('.35s ease', style({height: '*', opacity: '.2', transform: 'translateX(0)', 'box-shadow': 'none'})),
        animate('.35s ease', style({height: '*', opacity: 1, transform: 'translateX(0)'}))
      ])
    ])
  ])]
})
export class ListTableComponent implements OnInit, OnChanges {
  /**
   * Datos que se muestran en la tabla.
   *
   * @example
   * valores normales
   * tableColumns = [{name: 'Ciudad', val: 'nombre'}]
   * valores anidados
   * tableColumns = [{name: 'Pais', val: 'departamento', nested: 'pais.nombre', colSort: 'id'},
   * {name: 'Departamento', val: 'departamento', nested: 'nombre', colSort: 'id'}];
   * valores booleanos
   * {name: 'Anulado', val: 'anulado', cellOptions: {tipo: 'boolean'}},
   * Moneda
   * {name: 'Monto', val: 'monto', cellOptions: {tipo: 'currency'}},
   * Fecha
   * {name: 'Fecha Cierre', val: 'fecha_cierre', cellOptions: {tipo: 'date'}},
   */
  tableDataSrc!: MatTableDataSource<any> | any;
  /**
   * Material sort, para ordernar las columnas de la tabla.
   */
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  /**
   * Material paginator para el paginado de la tabla.
   */
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  /**
   * Nombre de columnas que se muentran en la tabla.
   */
  columns!: string[];
  /**
   * Nombre de las columnas para machear con el tableData a mostrar en cada row.
   */
  _columns!: string[];
  searchTarget = '';

  /**
   * Nombres de columnas para mostrar en la cabecera de la tabla.
   * este dato tiene la forma de {name: 'nombre columna', val: 'propiedad que se muestra en la columna'}
   * donde name es la columna donde se muestra el dato val.
   * esto sirve para tener como referencia para el filtrado de columna en el backend.
   */
  @Input('tableColumns') tableCols!: TableCol[];
  /**
   * Array de datos para los rows de la tabla.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  @Input() tableData: {}[] = [];
  /**
   * Indicia si se muestra la columna extra con los botones de accion [ver|editar|borrar].
   */
  @Input() mostrarAccion = true;
  /**
   * Indica si muestra el boton de accion Ver.
   */
  @Input() btnVer = true;
  /**
   * Indica si muestra el boton de accion Editar.
   */
  @Input() btnEditar = true;
  /**
   * indica si muestra el boton de accion Borrar.
   */
  @Input() btnBorrar = false;
  /**
   * Indica si muestra el boton de accion Imprimir.
   */
  @Input() btnImprimir = false;
  /**
   * Indica si muestra el boton de accion Agregar.
   */
  @Input() btnAgregar = false;
  /**
   * Indica si muestra la accion input check.
   */
  @Input() btnChec = false;
  /**
   * Label para el check.
   */
  @Input() btnChecTitle = '';
  /**
   * Label para boton imprimir.
   */
  @Input() btnImprimirTitle = '';
  /**
   * Indica si se muestra el form de filtro.
   */
  @Input() mostrarFiltro = true;
  /**
   * PlaceHolder para el campo filtro.
   */
  @Input() filterPlaceHolder = 'Filtro ...';

  /**
   * Servicio al que se llama para hacer las busquedas|cargas del listado en modo server-side.
   */
  @Input() serverList!: MetodosServicio<any>;

  /**
   * Accion que se llama cuando se hace click en el boton ver.
   */
  @Output() verEmitter: EventEmitter<null> = new EventEmitter<null>();
  /**
   * Accion que se llama cuando se hace click en el boton editar.
   */
  @Output() editarEmitter: EventEmitter<null> = new EventEmitter<null>();
  /**
   * Accion que se llama cuando se hace click en el boton borrar.
   */
  @Output() borrarEmitter: EventEmitter<number> = new EventEmitter<number>();
  /**
   * Accion que se llama cuando se hace click en el boton imprimir.
   */
  @Output() imprimirEmitter: EventEmitter<null> = new EventEmitter<null>();
  /**
   * Accion que se llama cuando se hace click en el boton agregar.
   */
  @Output() agregarEmitter: EventEmitter<null> = new EventEmitter<null>();
  /**
   * Accion que se llama cuanos se hace click en check.
   */
  @Output() checkEmitter: EventEmitter<null> = new EventEmitter<null>();
  /**
   * Accion para reiniciar la tabla.
   */
  @Input() reinicio: Observable<any> | any = new Observable<any>();
  /**
   * Indicativo para usar como columna default a ser ordenada.
   */
  @Input() defaultColumnToSort = '';
  /**
   * Indicativo para usar el orden default cuando se usa la columna default pasaro en defaultColumnToSort.
   */
  @Input() defaultColumnOrder = 'ASC';

  /**
   * Indican nombre de columna y valor a tomar para hacer una busqueda con listallbycampo
   */
  @Input() campoAnidado!: string;
  @Input() campoAnidadoFilter!: string;

  constructor(private matDialog: MatDialog) {
    this.reinicio.subscribe(() => {
      this.ngOnInit();
    });
  }

  @Input() btnOptionList: any = [];

  ngOnChanges(changes: SimpleChanges): void {
    try {
      if (changes['tableData'].currentValue) {
        this.tableData = changes['tableData'].currentValue;
        this.tableDataSrc = new MatTableDataSource(this.tableData);
        this.tableDataSrc.sort = this.sort;
        this.tableDataSrc.paginator = this.paginator;
      }

    } catch (e) {

    }

  }

  ngOnInit(): void {
    this.tableDataSrc = new MatTableDataSource(this.tableData);
    this.tableDataSrc.sort = this.sort;
    if (!this.serverList) {
      this.tableDataSrc.paginator = this.paginator;
    }
    this.columns = this.tableCols.map((e) => e.name);
    this._columns = this.columns;
    if (this.mostrarAccion) {
      this._columns.push('accion');
    }

    // Cambiar a pagina 0 cuando se cambia de columna a ordenar.
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.cargarTabl();
    });
    // traduccion de pagination
    this.paginator._intl.itemsPerPageLabel = 'Items por pagina';
    this.paginator._intl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ) => {
      const start = page * pageSize + 1;
      const end = (page + 1) * pageSize;
      return `${start} - ${end} de ${length}`;
    };
    this.cargarTabl();
  }

  /**
   * hace la carga de los datos de la tabla
   *
   * si es del modo estatico hace el filtro de los datos de acuerdo a la columna seleccionada.
   *
   * si es del modo server-side hace llamado al servicio serverlist.getAll pasando los datos para le flitrado y ordenado
   */
  cargarTabl(): void {
    let columSort: any = this.tableCols.map((e: any) => {
      if (e.name === this.sort.active) {
        return e.colSort ?? e.val;
      }
    }).filter((e) => e !== undefined)[0];
    let columSortDirection = this.sort.direction.toUpperCase();

    if (columSort === undefined && this.defaultColumnToSort !== '') {
      columSort = this.defaultColumnToSort;
      columSortDirection = this.defaultColumnOrder.toUpperCase();
    }
    // sort interno o por service (backend)
    if (!this.serverList) {
      this.tableDataSrc.filter = this.searchTarget.trim();
      this.tableDataSrc.data.sort((a: any, b: any) => {
        return (
          (a[columSort] < b[columSort] ? -1 : 1) *
          (columSortDirection === 'ASC' ? -1 : 1)
        );
      });
    } else {
      this.tableDataSrc.data = ['col-tem', 'col-tem', 'col-tem', 'col-tem', 'col-tem', 'col-tem', 'col-tem', 'col-tem',
        'col-tem', 'col-tem'];
      if (this.campoAnidado !== undefined && this.campoAnidadoFilter !== undefined) {
        this.serverList
          .getAllByCampo(
            this.searchTarget,
            `${this.paginator.pageSize}`,
            `${this.paginator.pageIndex + 1}`,
            columSortDirection,
            columSort,
            this.campoAnidado,
            this.campoAnidadoFilter
          )
          .toPromise()
          .then(m => {
            this.tableDataSrc.data = m?.data;
            this.paginator.length = m?.meta.registrosTabla;
          });
      } else {
        this.serverList
          .getAll(
            this.searchTarget,
            `${this.paginator.pageSize}`,
            `${this.paginator.pageIndex + 1}`,
            columSortDirection,
            columSort
          )
          .toPromise()
          .then(m => {
            this.tableDataSrc.data = m?.data;
            this.paginator.length = m?.meta.registrosTabla;
          });
      }
    }
  }

  /**
   * filtra los datos de la tabla
   *
   * @param ev string de busqueda
   */
  onSearchInput(ev: any): void {
    this.searchTarget = ev.target?.value ?? '';
    this.cargarTabl();
  }

  ver(row: any): void {
    this.verEmitter.emit(row);
  }

  editar(row: any): void {
    this.editarEmitter.emit(row);
  }

    borrar(row: any): void {
        if (this.serverList) {
            const data = {
                titulo: 'Atención',
                menssagejeError: 'Está seguro de eliminar el registro?',
                // esta variable es true cuando deben aparecer los botones aceptar y cancelar en el dialogo
                textoBtnAceptar: 'Aceptar',
                textoBtnCerrar: 'Cancelar',
                aceptarCancelar: true
            };
            const errorDialog = this.matDialog.open(DialogErrorComponent, {data, disableClose: true});
            errorDialog.afterClosed().subscribe(result => {
                if (result === 'aceptar') {
                    this.borrarEmitter.emit(row.id);
                    this.reinicio.subscribe(() => {
                        this.cargarTabl();
                    });
                }
            });

    } else {
      this.borrarEmitter.emit(row);
    }
  }

  imprimir(row: any): void {
    this.imprimirEmitter.emit(row);
  }

  agregar(row: any): void {
    this.agregarEmitter.emit(row);
  }

  check(row: any): void {
    this.checkEmitter.emit(row);
  }

  /**
   * saca el valor del row utilizando nestedProperty
   */
  getVal(row: any, col: TableCol): any {
    if (col.nested !== undefined) {
      return NestedProperty.get(row[col.val], col.nested);
    }
    return row[col.val];
  }
}
