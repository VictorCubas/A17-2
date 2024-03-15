import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SettingsService } from './settings.service';

@Injectable({
    providedIn: 'root'
})
export class SessionService {

    // sesion de usuario
    private session: Session | any = null;


    constructor(
        private router: Router,
        private http: HttpClient,
        private settings: SettingsService,
    ) {

    }

    /**
     * Almacena la sesion en memoria
     *
     * @param data datos de sesion de usuario
     */
    setSession(data: Session): void {
        this.session = data;
        localStorage.setItem('session', JSON.stringify(data));
        localStorage.setItem('accessToken', data.token);
    }

    existSession(): any {
        return this.session !== null;
    }
    /**
     * Retorna el token de acceso del usuario
     */
    public getAccessToken(): string {
        const session = localStorage.getItem('session');
        let token = null;

        if (session) {
            token = JSON.parse(session).token;
        }

        return localStorage.getItem('session') ? token : {refreshToken: '', token: '', usuario: '', nombre: '', apellido: ''};
        // return this.session.token;
    }

    /**
     * Actualiza el token/sesion del usuario
     */
    public refreshToken(): void {
    }

    logout(path = 'sign-out'): void {
        localStorage.removeItem('session');
        localStorage.removeItem('comercio');
        localStorage.removeItem('accessToken');
        this.session = null; //{refreshToken: '', token: '', usuario: '', moduloId: '', menuPermisos: []};
        this.router.navigate([path]);
    }

    /**
     * Retorna los módulos del usuario almacenado en el storage
     */
    public getModulos(): any {

        let session: any = localStorage.getItem('session');
        let menuPermisos = [];

        if (session) {
            session = JSON.parse(session);
            menuPermisos = session['menuPermisos'];
        }

        return session ? menuPermisos : [];
    }

    setModulo(data: any): void {
        localStorage.setItem('modulo', JSON.stringify(data));
    }

    getModulo(): any {
        const modulo = localStorage.getItem('modulo');
        if (modulo) {
            return JSON.parse(modulo);
        }
    }

    getMenuList(): any {
        const modulo = 'Comercio'; //this.getModulo();
        console.log(modulo);
        const modulos = this.getModulos();
        console.log(modulos);
        if (modulos) {
            return modulos;
        }
    }


    getTokenModulo(moduloId: number): Observable<any> {
        return this.http.post(`${this.settings.URL_BASE}login/actualizar_token`, { moduloId });
    }

    reemplazarTokenLocal(data: any): any {

        const localSession = localStorage.getItem('session');

        let session: Session = {refreshToken: '', token: '', usuario: '', moduloId: '', menuPermisos: [], nombre: '', apellido: ''};

        if (localSession) {
            session = JSON.parse(localSession);
        }

        session.token = data.token;
        session.moduloId = data.moduloId;
        localStorage.setItem('session', JSON.stringify(session));
        this.session = session;
    }

    getNombreUsuario(): any {
        console.log(this.session);
        if (!this.session) {
            return '';
        }
        return this.session?.nombre ? this.session.nombre + ' ' + this.session.apellido : '';
    }

    getDocumentoUsuario(): any {
        console.log(this.session);
        return this.session?.usuario ? this.session.usuario : '';
    }

    getComercios(): any {
        return this.session.comercios;
    }

    /**
     * Cambia el comercio a operar en la sesión del usuario (misma sesión, distinto comercio)
     *
     * @param comercioId identificador del comercio a gestionar
     * @returns token operacional para gestionar el nuevo comercio
     */
    cambiarComercio(id: number): Observable<any> {
        return this.http.post(`${this.settings.URL_BASE}fraccionate/login`, { comercioId: id });
    }
}

export interface Session {
    token: string;
    refreshToken: string;
    usuario: string;
    menuPermisos: any;
    moduloId: string;
    nombre?: string;
    apellido?: string;
    comercios?: Array<any>;
}
