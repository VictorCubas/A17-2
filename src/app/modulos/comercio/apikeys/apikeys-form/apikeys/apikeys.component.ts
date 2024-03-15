/* eslint-disable @typescript-eslint/naming-convention */
import {Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Apikeys } from 'app/clases/apikeys';
import { SnackbarService } from 'app/services/snackbar-service.service';
import { DialogConfirmComponent } from 'app/shared-comercio/components/dialog-confirm/dialog-confirm.component';
import { PageHeaderData } from 'app/shared-comercio/components/forms-header/page-header-data';
import { PageHeaderDataService } from 'app/shared-comercio/services/page-header-data.service';
import { ClipboardService } from 'ngx-clipboard';
import { ApikeysService } from '../../apikeys.service';
import { PublickeysComponent } from '../publickeys/publickeys.component';


@Component({
  selector: 'app-apikeys',
  templateUrl: './apikeys.component.html',
  styleUrls: ['./apikeys.component.scss']
})
export class ApikeysComponent implements OnInit {
  panelOpenState = true;
  form!: FormGroup;
  //item: Apikeys = null;
  dataSource: Apikeys[] = [];

  /* public_key_production: string;
   public_key_test: string;*/

  constructor(
    private fb: FormBuilder,
    public service: ApikeysService,
    private clipboardService: ClipboardService,
    private headerDataService: PageHeaderDataService,
    private snackbarSvc: SnackbarService,
    public dialog: MatDialog,
    //private matDialog: MatDialog,
  ) {

  }

  ngOnInit(): void {
    this.obtenerApiKeys();
    this.form = this.construirFormGroup();
    this.headerDataService.setHeaderData(new PageHeaderData('API Keys', 'comercio/apikeys', false));

  }

  openDialog(tipo: string): void {
    const dialogRef = this.dialog.open(PublickeysComponent, {
      width: '750px',
      data: {titulo: tipo, clave: ''},
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if(result){
        //validamos campos a actualizar
        if (tipo === 'Producción') {
          if (result.clave.length > 0) {
            this.service.updateClavePublica({
              public_key_production: result.clave
            }, this.form.controls['id'].value)
              .subscribe(() => {
                this.obtenerApiKeys();
              });
          }
        }
        if (tipo === 'Test') {
          if (result.clave.length > 0) {
            this.service.updateClavePublica({
              public_key_test: result.clave
            }, this.form.controls['id'].value)
              .subscribe(() => {
                this.obtenerApiKeys();
              });
          }

        }
        if (tipo === 'NotificacionProdu') {
          if (result.clave.length > 0) {
            this.service.updateClavePublica({
              url_notificacion_prod: result.clave
            }, this.form.controls['id'].value)
              .subscribe(() => {
                this.obtenerApiKeys();
              });
          }
        }
        if (tipo === 'NotificacionTest') {
          if (result.clave.length > 0) {
            this.service.updateClavePublica({
              url_notificacion_test: result.clave
            }, this.form.controls['id'].value)
              .subscribe(() => {
                this.obtenerApiKeys();
              });
          }
        }
      }

    });
  }


  construirFormGroup(): any {
    const form = this.fb.group({
      id: [null],
      api_key_production: [{value: ''}, Validators.required],
      api_key_test: [{value: ''}, Validators.required],
      url_production: [{value: ''}, Validators.required],
      url_test: [{value: ''}, Validators.required],
      public_key_production: [{value: ''}, Validators.required],
      public_key_test: [{value: ''}, Validators.required],
      codigo: [{value: ''}, Validators.required],
      comercio_id: [{value: ''}, Validators.required],
      url_notificacion_prod: [{value: ''}, Validators.required],
      url_notificacion_test: [{value: ''}, Validators.required],

    });
    return form;
  }


  copyText(valor: string): void {
    this.clipboardService.copyFromContent(valor);
    this.snackbarSvc.showMessage('Texto copiado!', 'success');
  }

  confirmarReseteo(tipo: any): any {
    this.dialogSucces(
      'Atención',
      `¿Confirma que desea cambiar el API KEY de ${tipo} ?`,
      () => this.resetearApiKey(tipo)
    );
  }

  dialogSucces(titulo: string, message: string, callBack?: any): void {
    const data = {
      titulo,
      menssage: message,
      aceptarCancelar: true,
      textoBtnAceptar: 'Aceptar',
      textoBtnCerrar: 'Cancelar',
    };
    const modalSuccess = this.dialog.open(DialogConfirmComponent, { data });
    modalSuccess.afterClosed().subscribe((result) => {
      if(result==='aceptar'){
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        callBack ? callBack(result) : null;
      }

    });
  }

  /**
   * Muestra un mensaje para alertar de que el usuario va a editar ambiente de producción
   *
   * @param mostrar mostrar true/false
   * @returns
   */
  alertaProduccion(event: any): void {

    console.log(event);

    if (event.index === 0) {
      return;
    }
    this.snackbarSvc.showMessage('Ambiente de producción');
  }

  private obtenerApiKeys(): any {
    this.service.getApikeysByComercio()
      .subscribe(
        (data: any) => {
          if (data !== null) {
            this.form.setValue(data[0]);
          }
        });
  }

  private resetearApiKey(tipo: any): any {
    this.service.resetearApiKey({
        tipo
    })
      .subscribe(
        (data: any) => {
          if (data !== null) {
            this.obtenerApiKeys();
          }
        });
  }

}
