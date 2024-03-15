import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackbarService } from 'app/services/snackbar-service.service';
import { DialogConfirmComponent } from 'app/shared-comercio/components/dialog-confirm/dialog-confirm.component';
import { DialogSuccessComponent } from 'app/shared-comercio/components/dialog-succes/dialog-success.component';
import { PasswordValidator } from 'app/_helpers/password.validator';
import { Subject, takeUntil } from 'rxjs';

import { RegistroService } from './registro.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent implements OnInit {
  formComercio!: FormGroup;
  formUsuario!: FormGroup;
  repForm!: FormGroup;
  unsubsribe$: Subject<any> = new Subject();
  urlTerminosCondiciones: string='#';

  hidePass = true;
  hideRepeat = true;

  errorsMsg: Array<{ type: ''; message: '' }> = [];

  // listado de tipos de comercios
  comercioTipoList: Array<any> = [];

  errorsPassMsg = [
    { type: 'required', message: 'Contraseña requerida.' },
    {
      type: 'minlength',
      message: 'Mínimo 6 caracteres',
    },
    {
      type: 'pattern',
      message:
        'Debe ingresar al menos una letra mayúscula, una minúscula y un número, no se permiten caracteres especiales',
    },
  ];

  errorsRepMsg = [
    { type: 'required', message: 'Contraseña requerida.' },
    {
      type: 'minlength',
      message: 'Mínimo 6 caracteres',
    },
    {
      type: 'pattern',
      message:
        'Debe ingresar al menos una letra mayúscula, una minúscula y un número, no se permiten caracteres especiales',
    },
    {
      type: 'areEqual',
      message: 'Las constraseñas no coinciden',
    },
  ];

  constructor(
    private registroSvc: RegistroService,
    private fb: FormBuilder,
    private snackbarSvc: SnackbarService,
    private matDialog: MatDialog,
    private router: Router
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.getTipoComercio();
    this.obtenerURLTerminosCondiciones();

    // const fn = () => {
    //   this.router.navigate(['../login']);
    // }

    // this.dialogInfo('Registro Exitoso', `Hemos enviado un email de activación de cuenta a nicolas.javier, revise su buzón y siga los pasos de activación`, fn)

  }

  getTipoComercio(): any {
    this.registroSvc
      .getTipoComercio()
      .pipe(takeUntil(this.unsubsribe$))
      .subscribe((resp: Array<any>) => {
        this.comercioTipoList = resp;
      });
  }

  public obtenerURLTerminosCondiciones(): any {
    this.registroSvc.getParametrosTyC({
      key: 'URL_TyC_COMERCIO'
    })
      .subscribe(
        (data: any) => {
          console.log(data);
          if (data !== null){
            console.log(data['value']);
            this.urlTerminosCondiciones = data['value'];
          }
        });
  }

  buildForm(): any {
    this.formComercio = this.fb.group({
      nombre: ['', Validators.required],
      comercioTipoId: ['', Validators.required],
      comercioTelefono: ['', Validators.required],
      web: [''],
      facebook: [''],
      instagram: [''],
      twitter: [''],
      comercioEmail: ['', Validators.required],
      ruc: ['', Validators.required],
    });

    this.formUsuario = this.fb.group({
      usuario: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      nombrePersona: ['', Validators.required],
      apellidoPersona: ['', Validators.required]
    });

    // nueva clave y confirmacion
    this.repForm = new FormGroup(
      {
        password: new FormControl(
          '',
          Validators.compose([
            Validators.minLength(6),
            Validators.required,
            Validators.pattern(
              '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$'
            ),
          ])
        ),
        passwordRep: new FormControl(
          '',
          Validators.compose([
            Validators.minLength(6),
            Validators.required,
            Validators.pattern(
              '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$'
            ),
          ])
        ),
      },
      (formGroup: any) => PasswordValidator.areEqual(formGroup)
    );
  }

  confirmarRegistro(aceptar: boolean): any {
    console.log(
      this.formComercio.getRawValue(),
      this.formUsuario.getRawValue()
    );

    if (!aceptar) {
      this.snackbarSvc.showMessage('Debe aceptar los términos y condiciones');
      return;
    }

    if (this.formComercio.invalid || this.formUsuario.invalid) {
      this.snackbarSvc.showMessage('Favor completar campos obligatorios');
      return;
    }

    if (this.repForm.invalid) {
      this.snackbarSvc.showMessage('Clave inválida');
      return;
    }

    const comercioNombre = this.formComercio.controls['nombre'].value;
    this.dialogSucces(
      'Atención',
      `¿Confirma que desea registrar el comercio ${comercioNombre}?`,
      () => this.sendForm()
    );
  }

  sendForm(): any {
    const clave = { contrasenha: this.repForm.controls['password'].value };
    const datos = {
      ...this.formComercio.getRawValue(),
      ...this.formUsuario.getRawValue(),
      ...clave,
    };

    const date = new Date(datos.fechaNacimiento);
    datos.fechaNacimiento = date.toISOString().split('T')[0];

    this.registroSvc
      .registrar(datos)
      .pipe(takeUntil(this.unsubsribe$))
      .subscribe(() => {
        this.reiniciarFormulario();

        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        const fn = () => {
          this.router.navigate(['../login']);
        };

        this.dialogInfo('Registro Exitoso', `Hemos enviado un email de activación de cuenta a ${datos.email}, revise su buzón y siga los pasos de activación`, fn);

      });
  }

  reiniciarFormulario(): any {
    this.formComercio.reset();
    this.formComercio.clearValidators();
    this.formUsuario.reset();
    this.formUsuario.clearValidators();
    this.repForm.reset();
    this.repForm.clearValidators();
  }

  dialogSucces(titulo: string, message: string, callBack?: any): void {
    const data = {
      titulo,
      menssage: message,
      aceptarCancelar: true,
      textoBtnAceptar: 'Aceptar',
      textoBtnCerrar: 'Cancelar',
    };
    const modalSuccess = this.matDialog.open(DialogConfirmComponent, { data });
    modalSuccess.afterClosed().subscribe((result) => {
      console.log(result);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      callBack ? callBack(result) : null;
    });
  }

  dialogInfo(title: string, menssageSucces: string, callBack?: any): void {
    const data = {
      title,
      menssageSucces,
      textoBtnAceptar: 'Aceptar',
    };
    const modalSuccess = this.matDialog.open(DialogSuccessComponent, { data });
    modalSuccess.afterClosed().subscribe((result) => {
      console.log(result);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      callBack ? callBack(result) : null;
    });
  }
}
