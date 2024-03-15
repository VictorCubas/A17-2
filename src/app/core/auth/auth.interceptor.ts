import { Injectable } from '@angular/core';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { SessionService } from 'app/services/session.service';
import { ErrorManager } from 'app/services/error-handler.service';
import { SnackbarService } from 'app/services/snackbar-service.service';
import { LoaderService } from 'app/services/loader.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    /**
     * Constructor
     */
    constructor(
        // private _authService: AuthService,
        private sessionService: SessionService,
        private errorManager: ErrorManager,
        private snackbar: SnackbarService,
        private loaderService: LoaderService
    ) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        let existResponse = false;

        let token = null;
        let request = req;

        token = this.sessionService.getAccessToken();

        if (token) {
            request = req.clone({
                setHeaders: {
                    authorization: `Bearer ${token}`,
                },
            });
        }

        // se muestra el loader
        this.loaderService.showLoader();

        return next.handle(request).pipe(
            tap(
                (event) => {
                    if (event instanceof HttpResponse) {
                        existResponse = true;
                        // creacion
                        if (request.method === 'POST') {
                            // mostrar mensaje 'CREACION EXITOSA'
                            this.snackbar.showMessage('Operación exitosa');
                        }

                        // actualizacion
                        if (request.method === 'PUT') {
                            // mostrar mensaje 'ACTUALIZACION EXITOSA'
                            this.snackbar.showMessage('Actualización exitosa');
                        }

                        // eliminacion
                        if (request.method === 'DELETE') {
                            // mostrar mensaje 'ELIMINACION EXITOSA'
                            this.snackbar.showMessage('Eliminación exitosa');
                        }
                    }
                },
                (error: HttpErrorResponse) => {
                    existResponse = true;

                    // aca vamos a invocar a nuestro manejador de errores
                    // y le pasamos el response para mostrar los mensajes
                    // adecuados para el usuario
                    this.errorManager.detectError(error);
                }
            ),
            finalize(() => {
                this.loaderService.hideLoader();
            })
        );
    }

    // /**
    //  * Intercept
    //  *
    //  * @param req
    //  * @param next
    //  */
    // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    // {

    //     console.log('--> Fuse interceptor', req.url);

    //     // Clone the request object
    //     let newReq = req.clone();

    //     // Request
    //     //
    //     // If the access token didn't expire, add the Authorization header.
    //     // We won't add the Authorization header if the access token expired.
    //     // This will force the server to return a "401 Unauthorized" response
    //     // for the protected API routes which our response interceptor will
    //     // catch and delete the access token from the local storage while logging
    //     // the user out from the app.
    //     if ( this._authService.accessToken && !AuthUtils.isTokenExpired(this._authService.accessToken) )
    //     {
    //         newReq = req.clone({
    //             headers: req.headers.set('Authorization', 'Bearer ' + this._authService.accessToken)
    //         });
    //     }

    //     // Response
    //     return next.handle(newReq).pipe(
    //         catchError((error) => {

    //             // Catch "401 Unauthorized" responses
    //             if ( error instanceof HttpErrorResponse && error.status === 401 )
    //             {
    //                 // Sign out
    //                 this._authService.signOut();

    //                 // Reload the app
    //                 location.reload();
    //             }

    //             return throwError(error);
    //         })
    //     );
    // }
}
