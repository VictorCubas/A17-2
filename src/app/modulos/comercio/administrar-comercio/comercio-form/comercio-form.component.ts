import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Comercio } from 'app/clases/comercio';
import { SettingsService } from 'app/services/settings.service';
import { SnackbarService } from 'app/services/snackbar-service.service';
import { PageHeaderData } from 'app/shared-comercio/components/forms-header/page-header-data';
import { NotificacionesService } from 'app/shared-comercio/services/notificaciones.service';
import { PageHeaderDataService } from 'app/shared-comercio/services/page-header-data.service';
import { Formularios } from 'app/_helpers/clases/formularios';
import { Subject, takeUntil } from 'rxjs';
import { ComercioService } from '../comercio.service';

@Component({
    selector: 'app-comercio-form',
    templateUrl: './comercio-form.component.html',
    styleUrls: ['./comercio-form.component.scss'],
})
export class ComercioFormComponent
    extends Formularios<Comercio>
    implements OnInit
{
    edit!: boolean;
    unsubscribe$: Subject<any> = new Subject();
    isChecked = true;
    comercioTipoList = [];

    id = null;

    logo = null;
    logoSend = null;

    rucErrorsMsg = [
        { type: 'required', message: 'N° documento requerido.' },
        {
            type: 'minlength',
            message: 'Mínimo 6 caracteres',
        },
        {
            type: 'pattern',
            message: 'formato de rut no valido. Mínimo 6 caracteres, favor ingresar con el siguiente formato Ej: 1234567-1',
        },
    ];
    rucNumberPattern = "(\\d{6,11}\\.?)(-[0-9])?$";

    constructor(
        public override router: Router,
        public dialog: MatDialog,
        private fb: FormBuilder,
        public notificacionService: NotificacionesService,
        public override service: ComercioService,
        private settings: SettingsService,
        private headerDataService: PageHeaderDataService,
        private comercioSvc: ComercioService,
        private snackbarSvc: SnackbarService,
    ) {
        super(
            router,
            dialog,
            'comercio/mis-comercios',
            service,
            notificacionService
        );
    }

    sendForm(): void {

        if (this.formularioAbs.invalid || this.formularioAbs.invalid) {
            this.snackbarSvc.showMessage('Favor completar campos obligatorios');
            return;
        }

        if (this.editar) {
            this.comercioSvc.actualizar(this.formularioAbs.getRawValue(), this.id, this.logoSend).pipe(takeUntil(this.unsubscribe$)).subscribe( () => {
                this.router.navigate(['../comercio/mis-comercios']);
            });
            return;
        }

        this.comercioSvc.registrar(this.formularioAbs.getRawValue(), this.logoSend).pipe(takeUntil(this.unsubscribe$)).subscribe( () => {
            this.comercioSvc.updateComercioSelector.next(true);
            this.router.navigate(['../comercio/mis-comercios']);
        });

    }

    /**
     * Recupera los tipos de comercio
     */
    getTipoComercio(): any {
        this.comercioSvc
            .getTipoComercio()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((resp: Array<any>) => {
                this.comercioTipoList = resp;
        });
    }

    override ngOnInit(): void {
        super.ngOnInit();

        this.getTipoComercio();

        this.edit = super.editar;
        this.construirFormGroup();
        if (super.editar) {
            console.log('Item', this.service.getItem());
            const item = this.service.getItem();
            this.logo = this.service.getItem()['logo'];
            this.id = this.service.getItem().id;
            item['nombre'] = item.nombreFantasia;
            item['comercioTipoId'] = item.comercioTipo['id'];
            item['comercioEmail'] = item.email;
            item['comercioTelefono'] = item.telefono;

            delete(item.id);
            delete(item['logo']);
            delete(item.nombreFantasia);
            delete(item.email);
            delete(item.telefono);
            delete(item.comercioTipo);
            delete(item['full_count']);
            delete(item.fechaHora);
            delete(item['verificado']);

            super.formularioAbs.setValue(item);
        } else {
            this.service.restartItem();
        }
        console.log(this.formularioAbs);
        console.log('abm', this.editar, this.abm);
        this.headerDataService.setHeaderData(
            new PageHeaderData(this.editar ? 'Modificar Comercio' : 'Registrar comercio', this.rutaPadre, true, false)
        );
    }

    override construirFormGroup(): any {
      super.formularioAbs = this.fb.group({
        nombre: [{value: '', disabled: super.dis}, Validators.required],
        comercioTipoId: [{value: '', disabled: super.dis}, Validators.required],
        comercioTelefono: [{value: '', disabled: super.dis}, Validators.required],
        web: [{value: '', disabled: super.dis}],
        facebook: [{value: '', disabled: super.dis}],
        instagram: [{value: '', disabled: super.dis}],
        twitter: [{value: '', disabled: super.dis}],
        comercioEmail: [{value: '', disabled: super.dis}, Validators.required],
        ruc: [{value: '', disabled: super.dis}, Validators.required],
      });
    }

    /**
     * Cambia la foto de perfil del comercio
     *
     * @param e evento de carga de imagen
     */
     async subirArchivo(e: any): Promise<void> {
        const files = e.srcElement.files;


        if (files) {
            try {
                if (files[0].type.includes('image')) {
                    this.logo = await this.blobToBase64(files[0]).then( data => data);
                }
                this.logoSend = files[0];
            } catch (error) {
                console.log(error);
            }
        }
    }

    blobToBase64(blob: Blob): any {
        return new Promise((resolve, _) => {
            const reader = new FileReader();
            reader.onloadend = (): any => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    }

}
