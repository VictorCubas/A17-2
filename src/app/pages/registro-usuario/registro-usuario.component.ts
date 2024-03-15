import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";
import {SnackbarService} from "../../services/snackbar-service.service";
import {PasswordValidator} from "../../_helpers/password.validator";
import {DialogConfirmComponent} from "../../shared/components/dialog-confirm/dialog-confirm.component";
import {MatDialog} from "@angular/material/dialog";
import {RegistroUsuarioService} from "./registro-usuario.service";
import {DialogSuccessComponent} from "../../shared/components/dialog-succes/dialog-success.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.component.html',
  styleUrls: ['./registro-usuario.component.scss']
})
export class RegistroUsuarioComponent implements OnInit {
  formUsuario!: FormGroup;
  repForm!: FormGroup;

  hideRepeat = true;
  hidePass = true;

  errorsMsg: Array<{ type: ''; message: '' }> = [];

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

  unsubsribe$: Subject<any> = new Subject();
  constructor(
    private registroSvc: RegistroUsuarioService,
    private fb: FormBuilder,
    private snackbarSvc: SnackbarService,
    private matDialog: MatDialog,
    private router: Router
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
  }

  buildForm() {

    this.formUsuario = this.fb.group({
      usuario: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
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
      (formGroup: any) => {
        return PasswordValidator.areEqual(formGroup);
      }
    );
  }


  confirmarRegistro() {

    if (this.formUsuario.invalid) {
      this.snackbarSvc.showMessage('Formulario Inválido');
      return;
    }

    if (this.repForm.invalid) {
      this.snackbarSvc.showMessage('Clave inválida');
      return;
    }


    this.dialogSucces(
      'Atención',
      `¿Confirma que desea registrar los datos?`,
      () => this.sendForm()
    );
  }

  sendForm() {

    const clave = { contrasenha: this.repForm.controls['password'].value };
    let datos = {
      ...this.formUsuario.getRawValue(),
      ...clave,
    };

    const date = new Date(datos.fechaNacimiento);
    datos.fechaNacimiento = date.toISOString().split('T')[0];

    this.registroSvc
      .registrar(datos)
      .pipe(takeUntil(this.unsubsribe$))
      .subscribe(() => {
        //this.reiniciarFormulario();

        const fn = () => {
          this.router.navigate(['../login']);
        };

        this.dialogInfo('Registro Exitoso', `Hemos enviado un email de activación de cuenta a ${datos.email}, revise su buzón y siga los pasos de activación`, fn)

      });
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
      callBack ? callBack(result) : null;
    });
  }
}
