import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MetodosServicio } from '../../../_helpers/interfaces/metodos-servicio';
import { Barrio } from '../../../clases/barrio';
import { SettingsService } from '../../../services/settings.service';
import { BasicResponse } from 'app/clases/basic-response';

@Injectable({
    providedIn: 'root',
})
export class BarrioService extends MetodosServicio<Barrio> {
    constructor(
        public override http: HttpClient,
        private settings: SettingsService
    ) {
        super(http, 'public/barrio', Barrio);
        console.log(this.settings.URL_BASE);
    }

    restartItem(): void {
        this.setItem(new Barrio());
    }

    crearBarrio(data: any): Observable<any> {
        return this.http.post(this.settings.URL_BASE + 'public/barrio', data);
    }

    actualizarBarrio(data: any, id: any): Observable<any> {
        return this.http.put(
            this.settings.URL_BASE + 'public/barrio/' + id,
            data
        );
    }

    eliminarBarrio(id: any): Observable<any> {
        return this.http.delete(this.settings.URL_BASE + 'public/barrio/' + id);
    }

    /**
     * Consulta de los registros. Cuenta con un filtro. [verificar su funcionamiento
     *
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
    ): Observable<BasicResponse<any>> {
        const params = new HttpParams()
            .set('filtro', filtro ?? '')
            .set('cantidad', cantidad !== 'undefined' ? cantidad : '10')
            .set('pagina', pagina ?? '0')
            .set('orden', orden ?? 'ASC')
            .set('columna', columna ?? 'id');

        return this.http.get<BasicResponse<any>>(
            `${this.settings.URL_BASE}/public/pais/departamento`,
            { params }
        );
    }

    /**
     * Permite recuperar valores de una tabla hijo enviando el id de la tabla padre, también proporciona filtro por nombre.
     *
     * Obs: para poder utilizar este método primero hay que cerciorarse qeu exista el endpoint correspondiente el en back,
     * porque este filtro no forma parte de la estructura genérica. Los endpoints en el back deben tener la siguiente
     * estructura {/pais/${parentId}/departamento} para poder funcionar correctamente.
     *
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
    ): Observable<BasicResponse<any>> {
        const params = new HttpParams()
            .set('columna', column ?? 'nombre')
            .set('filtro', filtro ?? '');
        return this.http.get<BasicResponse<any>>(
            `${this.settings.URL_BASE}/${parent}/${parentId}/${child}`,
            { params }
        );
    }
}
