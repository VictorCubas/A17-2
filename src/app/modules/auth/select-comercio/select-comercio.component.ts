import { Component, OnInit } from '@angular/core';
import { NavigationBehaviorOptions, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { SessionService } from 'app/services/session.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-select-comercio',
    templateUrl: './select-comercio.component.html',
    styleUrls: ['./select-comercio.component.scss'],
})
export class SelectComercioComponent implements OnInit {

    comercios = [
    ];

    nombreUsuario = '';
    _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
      private _router: Router,
      private sessionSvc: SessionService,
      private authSvc: AuthService,
    ) {
    }

    ngOnInit(): void {
        this.nombreUsuario = this.sessionSvc.getNombreUsuario();
        this.comercios = this.sessionSvc.getComercios();
    }

    seleccionarComercio(comercio: any): void {

      localStorage.setItem('comercio', JSON.stringify(comercio));

      // token del comercio
      this.authSvc.login({ comercioId: comercio.id}).pipe(takeUntil(this._unsubscribeAll)).subscribe( (resp: any) => {
        this._router.navigate(['comercio']);
        localStorage.setItem('comercio', JSON.stringify(comercio));
        this.sessionSvc.setSession(resp);
        this._router.navigateByUrl('comercio');
      });


    }

    nuevoComercio(): void {
        this._router.navigateByUrl('comercio/mis-comercios/registrar');
    }
}
