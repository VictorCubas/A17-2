/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { SettingsService } from 'app/services/settings.service';

@Injectable()
export class AuthService {
    private _authenticated: boolean = false;
    private session: Session = null;

    subtitleKeys = {
        administración: 'Funciones para usuario administrador',
        // dashboard: 'Resumen de peraciones del comercio',
        // desarrollo: 'Funciones para integracion de servicios',
        // venta: 'Fraccionamientos y ventas'
    };

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
        private settings: SettingsService,
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        const data = {
            aplicacionId: this.settings.APP_ID,
            email
        };
        return this._httpClient.post(`${this.settings.URL_BASE}/fraccionate/usuario/clave/reset`, data);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post('api/auth/sign-in', credentials).pipe(
            switchMap((response: any) => {
                // Store the access token in the local storage
                this.accessToken = response.accessToken;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    login(data: {
        username: string;
        password: string;
        aplicacionId: string;
        aplicacionVersion: string;
    } | any): Observable<any> {

        let cambioComercio = false;

        if (data.comercioId) {
            cambioComercio = true;
        }

        if (!cambioComercio) {
            data.aplicacionId = this.settings.APP_ID;
            data.aplicacionVersion = this.settings.APP_VERSION;
        }


        return this._httpClient
            .post(`${this.settings.URL_BASE}${cambioComercio ? 'fraccionate/' : ''}` + 'login', data)
            .pipe(
                map((resp: any) => {
                    const menuUpdate = [
                        {
                            id   : 'apps.dashboard',
                            title: 'Dashboard',
                            type : 'basic',
                            icon : 'stars',
                            link : '/comercio/dashboard',
                        },
                        {
                            id   : 'apps.desarrollo',
                            title: 'Desarrollos',
                            type : 'basic',
                            icon : 'domain',
                            link : '/apps/academy',
                        },
                        {
                            id   : 'apps.academy',
                            title: 'Departamentos',
                            type : 'basic',
                            icon : 'home_work',
                            link : '/apps/academy',
                        },
                        {
                            id   : 'apps.brokers',
                            title: 'Corredores',
                            type : 'basic',
                            icon : 'work',
                            link : '/comercio/clientes',
                        },
                        {
                            id   : 'apps.contacts',
                            title: 'Cuotero',
                            type : 'basic',
                            icon : 'calculate',
                            link : '/apps/contacts',
                        },
                        {
                            id   : 'apps.users',
                            title: 'Usuarios',
                            type : 'basic',
                            icon : 'person',
                            link : '/comercio/usuario',
                        },
                        {
                            id   : 'apps.settings',
                            title: 'Configuración',
                            type : 'basic',
                            icon : 'settings',
                            link : '/settings',
                        },
                    ];
                    // console.log(resp);
                    // resp.menuPermisos[0].menu.forEach((m: any) => {
                    //     const child = [];
                    //
                    //     if (m.menu) {
                    //         m.menu.forEach((sm: any) => {
                    //             child.push({
                    //                 id: sm.id,
                    //                 title: sm.nombre,
                    //                 type: 'basic',
                    //                 link: '/comercio' + sm.url,
                    //                 icon: sm.icono,
                    //             });
                    //         });
                    //     }
                    //
                    //     // console.log(child);
                    //
                    //     const newMenu = {
                    //         id: m.id,
                    //         title: m.nombre,
                    //         subtitle: this.subtitleKeys[m.nombre.toLowerCase()],
                    //         type: 'collapsable',
                    //         icon: m.icono ?? 'check',
                    //         children: child,
                    //     };
                    //
                    //     menuUpdate.push(newMenu);
                    //
                    //     console.log('menu Usuario',menuUpdate);
                    // });

                    const groupMenu = [
                        {
                            id: 'mGeneral',
                            title: 'Navegación',
                            subtitle: 'Menús de usuario',
                            type: 'group',
                            icon: 'home',
                            children: menuUpdate,
                        },
                    ];

                    resp.menuPermisos = {
                        compact: groupMenu,
                        default: groupMenu,
                        futuristic: groupMenu,
                        horizontal: groupMenu,
                    };
                    return resp;
                })
            );
    }

    /**
     * Almacena la sesion en memoria
     *
     * @param data datos de sesion de usuario
     */
    setSession(data: Session): any {
        localStorage.setItem('session', JSON.stringify(data));
        this.session = data;
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        // Renew token
        return this._httpClient
            .post('api/auth/refresh-access-token', {
                accessToken: this.accessToken,
            })
            .pipe(
                catchError(() =>
                    // Return false
                    of(false)
                ),
                switchMap((response: any) => {
                    // Store the access token in the local storage
                    this.accessToken = response.accessToken;

                    // Set the authenticated flag to true
                    this._authenticated = true;

                    // Store the user on the user service
                    this._userService.user = response.user;

                    // Return true
                    return of(true);
                })
            );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: {
        name: string;
        email: string;
        password: string;
        company: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: {
        email: string;
        password: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
}

export interface Session {
    token: string;
    refreshToken: string;
    usuario: string;
    menuPermisos: any;
    moduloId: string;
    cambiarClave: boolean;
    personaExiste: boolean;
    usuarioId: string;
}
