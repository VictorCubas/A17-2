import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable(
    {providedIn: 'root'}
)
export class SnackbarService {

    constructor(
        private snackbar: MatSnackBar
    ) {}

    /**
     * Muestra un snackbar en la parte inferior
     * @param message mensaje a mostrar
     * @param color color del snackbar success, warning, danger
     * @param duration duracion del snackbar, default 1.5 segundos
     * @param action mensaje para boton de accion
     */
    showMessage(message: string, color = 'success', duration: number = 1500, action: string = ''): void {
        this.snackbar.open(message, action, { duration, panelClass: color });
    }

    /**
     * Oculta el snackbar en caso de ser necesario, util para llamadas del tipo post
     */
    noMessage(): void {
        this.snackbar.dismiss();
    }

}
