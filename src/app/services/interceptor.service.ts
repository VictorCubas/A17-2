import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { SessionService } from './session.service';
import { ErrorManager } from './error-handler.service';
import { SnackbarService } from './snackbar-service.service';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
  constructor(
    private sessionService: SessionService,
    private errorManager: ErrorManager,
    private snackbar: SnackbarService,
    private loaderService: LoaderService
  ) {
  }

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
}
