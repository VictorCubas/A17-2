import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BasicResponse } from '../clases/basic-response';

interface ConstrucctorGeneric<T> {
  new (): T;
}

/**
 * Servicio genérico que posee todas las funciones básicas de un servicio. Este servicio debe ser heredado.
 * @author Marcos Ortega <maortega@fctunca.edu.py>
 */
@Injectable({
    providedIn: 'root',
})
export abstract class MetodosServicio<T> {
  item: T | any;

  /**
   * @param http instancia de HttpClient
   * @param ruta Ruta del endpoint correspondiente a un módulo CRUD (no es necesario colocar barra al inicio)
   * @param ctor Constructor genérico, deber e recibir la clase entidad del módulo a ser creado.
   * @example
   *     super(http, 'public/pais', Pais);
   */
  constructor(
    public http: HttpClient,
    @Inject(String) private ruta: string,
    @Inject('ctor') ctor?: ConstrucctorGeneric<T>
  ) {
    this.ruta = ruta;
    if (ctor !== undefined) {
      this.item = new ctor();
    }
  }

  /**
   * Consulta de los registros. Cuenta con un filtro. [verificar su funcionamiento
   * @param filtro string texto a ser filtrado.
   * @param cantidad string indica la cantidad de row a retornar. default 10
   * @param pagina string indica la pagina en la que esta buscando. default 0
   * @param orden string indica el orden en que vienen las columnas del sort default ASC
   * @param columna string es la columna en el cual se hace el orden.
   */
  getAll(
    filtro?: string,
    cantidad?: string | any,
    pagina?: string,
    orden?: string,
    columna?: string
  ): Observable<BasicResponse<Array<T>>> {
    const params = new HttpParams()
      .set('filtro', filtro ?? '')
      .set('cantidad', cantidad != 'undefined' ? cantidad : '10')
      .set('pagina', pagina ?? '0')
      .set('orden', orden ?? 'ASC')
      .set('columna', columna ?? 'id');
    return this.http.get<BasicResponse<Array<T>>>(this.ruta, { params });
  }

  /**
   * Buscar por un campo en específico.
   * @param filtro string texto a ser filtrado.
   * @param cantidad string indica la cantidad de row a retornar. default 10
   * @param pagina string indica la pagina en la que esta buscando. default 0
   * @param orden string indica el orden en que vienen las columnas del sort default ASC
   * @param columna string es la columna en el cual se hace el orden.
   * @param campo string es el campo anidado por el cuál se hará la busqueda
   * @param campoFiltro string es la busqueda que se hace en el campo, si no se pasa se usara la varibale filter para buscar.
   * @example
   * /comercio/sucursal?empresa_sucursal__nombre=pino
   */
  getAllByCampo(
    filtro?: string,
    cantidad?: string,
    pagina?: string,
    orden?: string,
    columna?: string,
    campo?: string | any,
    campoFiltro?: string
  ): Observable<BasicResponse<Array<T>>> {
    const params = new HttpParams()
      .set('cantidad', cantidad ?? '10')
      .set('pagina', pagina ?? '0')
      .set('orden', orden ?? 'ASC')
      .set('columna', columna ?? 'id')
      .set(campo, campoFiltro ?? filtro ?? '');
    return this.http.get<BasicResponse<Array<T>>>(this.ruta, { params });
  }

  /**
   * Busca un registro en especíco por medio de su id.
   * @param id Identificador único del registro.
   */
  getById(id: number): Observable<T | any> {
    return this.http
      .get<BasicResponse<T>>(`${this.ruta}/${id}`)
      .pipe(map((res) => res.data));
  }

  /**
   * Guarda un registro.
   * @param item Registro a ser guardado.
   */
  save(item: T): Observable<T | any> {
    return this.http
      .post<BasicResponse<T>>(this.ruta, item)
      .pipe(map((res) => res.data));
  }

  /**
   * Actualiza un registro.
   * @param item Registro a ser actualizado.
   */
  update(item: T | any): Observable<any> {
    return this.http.put<any>(`${this.ruta}/${item['id']}`, item);
  }

  /**
   * Elimina un registro.
   * @param id Identicador único del registro a ser eliminado.
   */
  delId(id: number): Observable<any> {
    return this.http.delete(`${this.ruta}/${id}`);
  }

  /**
   * Recupera el valor del item enviado el formulario.
   */
  getItem(): T {
    return this.item;
  }

  /**
   * Setea el valor del item que será enviado al formulario
   * @param item valor seleccionado en una lista.
   */
  setItem(item: T): void {
    this.item = item;
  }

  /**
   * Reinicia el valor del item.
   */
  abstract restartItem(): void;

  /**
   * Permite recuperar valores de una tabla hijo enviando el id de la tabla padre, también proporciona filtro por nombre.
   *
   * Obs: para poder utilizar este método primero hay que cerciorarse qeu exista el endpoint correspondiente el en back,
   * porque este filtro no forma parte de la estructura genérica. Los endpoints en el back deben tener la siguiente
   * estructura {/pais/${parentId}/departamento} para poder funcionar correctamente.
   * @param parent Nombre del arent en la ruta /pais/${parentId}/departamento (donde país es el arent)
   * @param child Nombre del child en la ruta /pais/${parentId}/departamento (donde departamento es el child)
   * @param parentId Id del registro arent en el cado de departamento sería el paisId.
   * @param column Columna en la cual se realizará la búsqueda.
   * @param filtro Texto a utilizar en el filtro
   */
  getListByNameAndParentId(
    parent: string,
    child: string,
    parentId: number,
    column: string,
    filtro: string
  ): Observable<BasicResponse<Array<T>>> {
    const params = new HttpParams()
      .set('columna', column ?? 'nombre')
      .set('filtro', filtro ?? '');
    return this.http.get<BasicResponse<Array<T>>>(
      `${parent}/${parentId}/${child}`,
      { params }
    );
  }

  getList(): Observable<BasicResponse<Array<T>>> {
    return this.http.get<BasicResponse<Array<T>>>(this.ruta);
  }
}
