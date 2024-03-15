import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
// import { PasswordResetComponent } from '../password-reset/password-reset.component';
import { SessionService } from '../services/session.service';
import { SnackbarService } from '../services/snackbar-service.service';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  form!: FormGroup;

  usuarioErrorsMsg = [
    { type: 'required', message: 'N° documento requerido.' },
    {
      type: 'minlength',
      message: 'Mínimo 6 caracteres',
    },
    {
      type: 'pattern',
      message: 'Solo se permiten números',
    },
  ];

  passwordErrorsMsg = [
    { type: 'required', message: 'Contraseña requerida.' },
    // {
    //   type: 'minlength',
    //   message: 'Mínimo 6 caracteres',
    // },
    // {
    //   type: 'pattern',
    //   message: 'Debe ingresar al menos una letra mayúscula, una minúscula y un número, no se permiten caracteres especiales',
    // },
  ];

  hideCurrent = true;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private loginService: LoginService,
    private sessionService: SessionService,
    private dialog: MatDialog,
    private snackbarSvc: SnackbarService,
  ) {
    this.initForm();
  }

  ngOnInit(): void {}

  initForm(): void {
    this.form = this.fb.group({
      username: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required,
        Validators.pattern('[0-9]+$')
     ])),
      password: new FormControl('', Validators.compose([
        // Validators.minLength(6),
        Validators.required,
        // Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
     ])),
    });
  }

  login(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loginService.login(this.form.getRawValue()).subscribe((res: any) => {

      // if (res.cambiarClave) {
      //   this.snackbar.dismiss();
      //   const dialog = this.dialog.open(PasswordResetComponent, {
      //     maxHeight: 600,
      //     maxWidth: 600,
      //     data: {
      //       token: res.token,
      //       mensaje: `Por motivos de seguridad por favor defina una nueva contraseña.`
      //     }
      //   });

      //   dialog.afterClosed();
      //   return;

      // }

      this.snackbarSvc.noMessage();

      this.sessionService.setSession(res);

      // if (res.menuPermisos.length > 0) {
        if (res.menuPermisos.length === 1) {
          this.sessionService.setModulo(res.menuPermisos[0].modulo.toLowerCase());

          const dataString = JSON.stringify(res.menuPermisos[0]);
          const esDesarrollador = dataString.includes('Api keys') && !dataString.includes('Usuario');

          if (esDesarrollador) {
            this.router.navigate(['/comercio/apikeys']);
          } else {
            this.router.navigate([res.menuPermisos[0].modulo.toLowerCase()]);
          }

        } else {
          this.router.navigate(['']);
        }
        this.snackbarSvc.showMessage('BIENVENIDO', 'success');
      // }
      // else {
      //   this.snackbarSvc.showMessage('Su usuario no tiene módulos asignados. Verifique con el operador', 'warning');
      // }
    });

  }
}
