import { Injectable } from '@angular/core';
import { AlertService } from '@full-fledged/alerts';


@Injectable({
    providedIn: 'root'
})
export class NotificacionesService {

    constructor(private alertService: AlertService) {
    }
    success(mensaje: string | { html: string }): void {
        this.alertService.success(mensaje);
    }

    danger(mensaje: string | { html: string }): void {
        this.alertService.danger(mensaje);
    }

    info(mensaje: string | { html: string }): void {
        this.alertService.info(mensaje);
    }

    warning(mensaje: string | { html: string }): void {
        this.alertService.warning(mensaje);
    }

}
