import {
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    NgForm,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '@full-fledged/alerts';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AuthService } from 'app/core/auth/auth.service';
import { PasswordValidator } from 'app/_helpers/password.validator';
import { Subject, takeUntil } from 'rxjs';
import { SignUpService } from './sign-up.service';

@Component({
    selector: 'auth-sign-up',
    templateUrl: './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AuthSignUpComponent implements OnInit, OnDestroy {
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };

    comercioForm: FormGroup;
    usuarioForm: FormGroup;
    repForm!: FormGroup;
    showAlert: boolean = false;
    comercioTipoList = [];
    unsubscribe$: Subject<any> = new Subject();

    hidePass = true;
    hideRepeat = true;

    logo = null; // imagen a mostrar
    logoSend = null; // formato de envio

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

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private signUpSvc: SignUpService,
        private _alertSvc: AlertService,
        private _fuseConfirmation: FuseConfirmationService
    ) {
        this.buildForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        // this.signUpForm = this._formBuilder.group({
        //         name      : ['', Validators.required],
        //         email     : ['', [Validators.required, Validators.email]],
        //         password  : ['', Validators.required],
        //         company   : [''],
        //         agreements: ['', Validators.requiredTrue]
        //     }
        // );

        this.getTipoComercio();
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next(true);
        this.unsubscribe$.complete();
    }

    buildForm(): any {
        this.comercioForm = this._formBuilder.group({
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

        this.usuarioForm = this._formBuilder.group({
            usuario: ['', Validators.required],
            telefono: ['', Validators.required],
            email: ['', Validators.required],
            fechaNacimiento: ['', Validators.required],
            nombrePersona: ['', Validators.required],
            apellidoPersona: ['', Validators.required],
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

    getTipoComercio(): any {
        this.signUpSvc
            .getTipoComercio()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((resp: Array<any>) => {
                this.comercioTipoList = resp;
            });
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign up
     */
    signUp(aceptar = false): void {
        //     // Do nothing if the form is invalid
        //     if ( this.signUpForm.invalid )
        //     {
        //         return;
        //     }
        //     // Disable the form
        //     this.signUpForm.disable();
        //     // Hide the alert
        //     this.showAlert = false;
        //     // Sign up
        //     this._authService.signUp(this.signUpForm.value)
        //         .subscribe(
        //             (response) => {
        //                 // Navigate to the confirmation required page
        //                 this._router.navigateByUrl('/confirmation-required');
        //             },
        //             (response) => {
        //                 // Re-enable the form
        //                 this.signUpForm.enable();
        //                 // Reset the form
        //                 this.signUpNgForm.resetForm();
        //                 // Set the alert
        //                 this.alert = {
        //                     type   : 'error',
        //                     message: 'Something went wrong, please try again.'
        //                 };
        //                 // Show the alert
        //                 this.showAlert = true;
        //             }
        //         );
        console.log(
            this.comercioForm.getRawValue(),
            this.usuarioForm.getRawValue()
        );

        this.showAlert = true;

        if (!aceptar) {
            // this.snackbarSvc.showMessage(
            //     'Debe aceptar los términos y condiciones'
            // );
            this.alert = {
                type: 'error',
                message: 'Debe acpetar los términos y condiciones',
            };
            return;
        }

        if (this.comercioForm.invalid || this.usuarioForm.invalid) {
            // this.snackbarSvc.showMessage('Favor completar campos obligatorios');
            this.alert = {
                type: 'error',
                message: 'Favor completar campos requeridos',
            };
            return;
        }

        if (this.repForm.invalid) {
            // this.snackbarSvc.showMessage('Clave inválida');
            this.alert = {
                type: 'error',
                message: 'Clave inválida',
            };
            return;
        }

        this.showAlert = false;

        const clave = { contrasenha: this.repForm.controls['password'].value };
        const datos = {
            ...this.comercioForm.getRawValue(),
            ...this.usuarioForm.getRawValue(),
            ...clave,
        };

        const date = new Date(datos.fechaNacimiento);
        datos.fechaNacimiento = date.toISOString().split('T')[0];

        this._fuseConfirmation
            .open({
                icon: {
                    name: 'warning',
                },
                title: 'Creación de Cuenta',
                message: '¿Confirma que desea registrar el comercio ' + datos.nombre + '?.',
                actions: {
                    confirm: {
                        label: 'Aceptar',
                        color: 'accent',
                    },
                    cancel: {
                        label: 'Cancelar',
                    },
                },
            })
            .afterClosed()
            .subscribe((resp) => {
                if (resp === 'confirmed') {

                    this.signUpSvc.registrar(datos, this.logoSend).pipe(takeUntil(this.unsubscribe$)).subscribe( () => {
                        this._fuseConfirmation.open({
                            dismissible: false,
                            icon: {
                                name: 'check'
                            },
                            actions: {
                                confirm: {
                                    label: 'Aceptar',
                                    color: 'accent'
                                },
                                cancel: {
                                    label: 'Cerrar'
                                }
                            },
                            title: 'Importante',
                            message: 'Cuenta creada, verifique su buzón de correo para activar la cuenta'
                        }).afterClosed().subscribe( () => {
                            this._router.navigate(['../sign-in']);
                        });
                    });

                }
            });

        // const comercioNombre = this.formComercio.controls['nombre'].value;
        // this.dialogSucces(
        //     'Atención',
        //     `¿Confirma que desea registrar el comercio ${comercioNombre}?`,
        //     () => this.sendForm()
        // );
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
