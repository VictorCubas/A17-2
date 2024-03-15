import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SessionService } from './session.service';
import { SnackbarService } from './snackbar-service.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogErrorComponent } from '../shared-comercio/components/dialog-error/dialog-error.component';
import { AuthService } from 'app/core/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorManager {
  constructor(
    private sessionService: SessionService,
    private snackbar: SnackbarService,
    private matdialog: MatDialog,
    private _authService: AuthService
  ) {}

  detectError(errorResponse: HttpErrorResponse | ErrorEvent | any): void {
    // el mensaje final a mostrar en el dialog o snackbar
    let viewMsg = 'No se pudo obtener conexión con el servidor';
    let msg: string = '';
    if (errorResponse instanceof HttpErrorResponse) {
      switch (errorResponse.status) {
        case 462:
          this.goLogin();
          break;
        case 0:
          msg = 'Verifique su conexión';
          break;
        case 404:
          msg = 'Ocurrió un error inesperado';
          break;
        // case 500:
        //   msg = 'Ocurrió un error inesperado';
        //   break;
        default:
          // mensaje de error en el response
          // const errorObj: any = errorResponse.error;
          // mensajes a mostrar
          viewMsg = errorResponse.error.message;
          msg = viewMsg.toString();
          break;
      }

      console.log(viewMsg);

      // this.snackbar.showMessage(msg, 'danger');
      /* si tiene mas de un mensaje o si tiene un solo mensaje con mas de 50
            caracteres entonces el mensaje se muestra en un dialog */
      if (viewMsg.length < 50) {
        // mostrar como alert
        this.snackbar.showMessage(viewMsg, 'error');
      } else {
        // mostrar como dialog
        this.dialogInfo('Atención', viewMsg);
      }
    }
  }

  goLogin(): void {
    this.snackbar.showMessage(
      'Su sesión ha expirado, ingrese nuevamente',
      'warning'
    );
    this._authService.signOut();
    this.sessionService.logout();
    location.reload();
  }

  dialogInfo(titulo: string, menssagejeError: string, callBack: any = null): void {
    const data = {
      titulo,
      menssagejeError,
      textoBtnAceptar: 'Aceptar',
    };
    const modalSuccess = this.matdialog.open(DialogErrorComponent, { data });
    modalSuccess.afterClosed().subscribe((result) => {
      console.log(result);
      if (callBack) {
        callBack(result);
      }
    });
  }
}
