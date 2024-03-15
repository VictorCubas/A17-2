import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { SnackbarService } from 'app/services/snackbar-service.service';
import { PageHeaderData } from 'app/shared-comercio/components/forms-header/page-header-data';
import { PageHeaderDataService } from 'app/shared-comercio/services/page-header-data.service';
import { Subject, takeUntil } from 'rxjs';
import { ConfiguracionComercioService } from './configuracion-comercio.service';

@Component({
    selector: 'app-configuracion-comercio',
    templateUrl: './configuracion-comercio.component.html',
    styleUrls: ['./configuracion-comercio.component.scss'],
    animations: fuseAnimations,
})
export class ConfiguracionComercioComponent implements OnInit {
    @ViewChild(MatTable) firmanteTable: MatTable<any>;

    @ViewChild(MatStepper) matStepper: MatStepper;

    // lista de pasos a mostrar para el usuario, solo se muestran
    // los pasos que exisan en el arreglo
    pasosLista = [];

    pasosKeys = {
        paso1: 'DE1',
        paso2: 'DF2',
        paso3: 'DC3',
        paso4: 'D4',
        paso5: 'F5',
    };

    // array de objetos para controlar las secciones verificadas
    seccionesVerificadas = [
        // eslint-disable-next-line @typescript-eslint/naming-convention
        { DE1: false, color: '' },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        { DF2: false, color: '' },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        { DC3: false, color: '' },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        { D4: false, color: '' },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        { F5: false, color: '' }
    ];

    fDatosEmpresa: FormGroup;

    docRucColumns = ['#', 'nombre', 'accion', 'estado', 'ver'];
    docRucList = [
        {
            numero: 1,
            nombre: 'Constancia de RUC',
            estado: '', // se reemplaza de lo que viene del BE,
            value: null,
        },
        {
            numero: 2,
            nombre: 'Constancia de CCT',
            estado: '', // se reemplaza de lo que viene del BE
            value: null,
        },
    ];


    fFirmante: FormGroup;
    fBanco: FormGroup;
    fDocumentos: FormGroup;

    contactoColumns = ['nombre', 'numero', 'acciones'];
    contactoList = []; // listado para numeros de contacto, requerido

    listadoFirmantes = []; // listado de firmantes requerido
    firmanteColumns = ['nombre', 'cargo', 'documentoA','documentoB', 'estado', 'acciones'];
    firmanteList = []; // listado para numeros de contacto, requerido

    // listado de documentos requerdiso para entidad/empresa
    documentoColumns = ['#', 'nombre', 'plantilla', 'accion', 'estado', 'ver'];
    documentoList = [
        {
            nro: 1,
            id: null,
            nombre: 'Copia de Constitución de la Firma',
            value: null,
            template: null,
        },
        { nro: 2, id: null, nombre: 'Copia de Acta de asamblea', value: null },
        {
            nro: 3,
            id: null,
            nombre: 'Copia poder de representación de la firma',
            value: null,
            template: null,
        },
    ];
    documentosDataKeys = {
        copiaConstitucionFirma: 'Copia de constitución de la Firma',
        copiaActaAsamblea: 'Copia de acta de asamblea',
        copiaPoderRepresentacionFirma:
            'Copia poder de representación de la firma',
    };

    tipoEntidadList = [];

    unsubscribe$: Subject<any> = new Subject();

    // controla la carga de documentos, permite que sea editable
    cargarDocumentos = true;
    documentosCargados = false;

    finalizado = false;

    mostrarTextoPlantilla = false;

    seccionGuardada = null;
    indiceActual = 3;

    seccionParametro = null;

    constructor(
        private _fb: FormBuilder,
        private headerDataService: PageHeaderDataService,
        private configComercioSvc: ConfiguracionComercioService,
        private _fuseConfirmation: FuseConfirmationService,
        private snackbarService: SnackbarService,
        private route: ActivatedRoute
    ) {
        this.headerDataService.setHeaderData(
            new PageHeaderData(
                'Configuración de la cuenta',
                'comercio/dashboard',
                true,
                false
            )
        );
        this.buildForm();
    }

    ngOnInit(): void {

        this.route.params.subscribe((params: Array<string>) => {
            this.seccionParametro = params['seccion'] ?? null;
        });

        this.getSeccionesDisponibles();

        // si hay una sección recibida como parametro redirige a esa seccion y no recupera la última seccion guardada
        // caso contrario si no hay parametro y se accede a la pantalla, se redige a la ultima guardada

        // this.getSeccionActual();
    }

    getSeccionActual(): void {
        this.configComercioSvc.seccionActual().pipe(takeUntil(this.unsubscribe$)).subscribe( (data: any) => {
            this.seccionGuardada = data.seccionActual;

            // setTimeout(() => {
                this.navegarSeccion();
            // }, 2000);

        });
    }

    navegarSeccion(): void {
        if (!this.seccionGuardada) {
            return;
        }

        if (this.seccionGuardada === this.pasosKeys.paso2) {
            this.matStepper.next();
            return;
        }
        if (this.seccionGuardada === this.pasosKeys.paso3) {
            this.matStepper.next();
            this.matStepper.next();
            return;
        }
        if (this.seccionGuardada === this.pasosKeys.paso4) {
            this.matStepper.next();
            this.matStepper.next();
            this.matStepper.next();
            return;
        }
        if (this.seccionGuardada === this.pasosKeys.paso5) {
            this.matStepper.next();
            this.matStepper.next();
            this.matStepper.next();
            this.matStepper.next();
            return;
        }
    }

    getTipoEmpresa(): void {
        this.configComercioSvc
            .getTipoEmpresa()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((resp: Array<any>) => {
                this.getDatosEmpresa();

                this.tipoEntidadList = resp;

                if (this.seccionesVerificadas[0][this.pasosKeys.paso1]) {
                    this.fDatosEmpresa.disable();
                }
            });
    }

    getSeccionesDisponibles(): any {
        this.configComercioSvc
            .getSeccionesDisponibles()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((resp: any) => {
                this.pasosLista = resp.seccionesDisponibles;
                this.seccionesVerificadas = resp.seccionesVerificadas;
                this.finalizado = this.seccionesVerificadas[this.seccionesVerificadas.length-1][this.pasosKeys.paso5];

                this.getTipoEmpresa();
                this.getFirmantes();
                this.getDatosBanco();
                this.getDocumentosEmpresa();


                // recupera la seccion actual
                setTimeout(() => {
                    if (this.seccionParametro) {
                        this.seccionGuardada = this.seccionParametro;
                        this.navegarSeccion();
                    } else {
                        this.getSeccionActual();
                    }
                }, 1300);
            });
    }

    /**
     * Se recuperan y se actualizan las secciones verificadas
     */
    getSeccionesVerificadas(event: any = null): void {

        this.configComercioSvc
            .getSeccionesDisponibles()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((resp: any) => {

                this.snackbarService.noMessage();

                this.pasosLista = resp.seccionesDisponibles;
                this.seccionesVerificadas = resp.seccionesVerificadas;

                if (this.seccionesVerificadas[0][this.pasosKeys.paso1]) {
                    this.fDatosEmpresa.disable();
                }

                if (this.seccionesVerificadas[1][this.pasosKeys.paso2]) {
                    this.fFirmante.disable();
                }

                if (this.seccionesVerificadas[2][this.pasosKeys.paso3]) {
                    this.fBanco.disable();
                }

                if (this.seccionesVerificadas[3][this.pasosKeys.paso4]) {
                    this.cargarDocumentos = false;
                }

                if (this.seccionesVerificadas[this.seccionesVerificadas.length-1][this.pasosKeys.paso5]) {
                    this.finalizado = this.seccionesVerificadas[this.seccionesVerificadas.length-1][this.pasosKeys.paso5];
                }


            });
    }

    buildForm(): any {
        this.fDatosEmpresa = this._fb.group({
            razonSocial: ['', Validators.required],
            ruc: [null, Validators.required],
            cct: [null, Validators.required],
            direccion: ['', Validators.required],
            tipoEntidad: ['', Validators.required],
            estado: [''],
        });

        this.fFirmante = this._fb.group({
            nombre: [''],
            cargo: [''],
            copiaCedula: [null],
            copiaCedulaB: [null],
            estado: [''],
            lista: [[], Validators.required],
        });

        this.fBanco = this._fb.group({
            banco: ['', Validators.required],
            nroCuenta: ['', Validators.required],
            ruc: ['', Validators.required],
            razonSocial: ['', Validators.required],
            estado: [''],
        });

        this.fDocumentos = this._fb.group({
            copiaConstitucionFirma: [null, Validators.required],
            copiaActaAsamblea: [null, Validators.required],
            copiaPoderRepresentacionFirma: [null, Validators.required],
        });

        this.fDocumentos =  this._fb.group({});

    }

    /**
     * Recupera los datos de los firmantese
     */
    getFirmantes(): any {
        this.configComercioSvc
            .getFirmantes()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((resp: any) => {

                // this.seccionesVerificadas[1].color = resp.estadoColor;


                this.firmanteList = resp.firmantes;
                this.fFirmante.controls.lista.setValue(resp.firmantes);
                this.fFirmante.controls.estado.setValue(resp.estado);
                this.firmanteTable.renderRows();

                if (this.seccionesVerificadas[1][this.pasosKeys.paso2]) {
                    this.fFirmante.disable();
                }
            });
    }

    /**
     * Agrega un contacto a la lista de contactos
     */
    addFirmante(): void {
        const fData = this.fFirmante.value;
        if (fData.nombre.length === 0 || fData.cargo.length === 0) {
            this.snackbarService.showMessage('Verificar datos del formulario');
            return;
        }

        if (!fData.copiaCedula) {
            this.snackbarService.showMessage('Debe cargar el documento del firmante');
            return;
        }

        const firmante = new FormData();
        firmante.append('nombre', fData.nombre);
        firmante.append('cargo', fData.cargo);
        firmante.append('ci', fData.copiaCedula);
        firmante.append('ciOpcional', fData.copiaCedulaB);

        this.configComercioSvc
            .guardarFirmante(firmante)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((resp: any) => {
                this.fFirmante.reset();
                this.getFirmantes();
            });
    }

    removerFirmante(e: { id: number }): void {
        this.configComercioSvc
            .removerFirmante(e.id)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(() => {
                this.getFirmantes();
            });
    }

    async subirArchivo(
        e: any,
        form: string,
        controlName: string
    ): Promise<any> {

        const files = e.srcElement.files;

        if (files) {
            try {
                if (files[0].type.includes('image')) {
                    await this.blobToBase64(files[0]).then((data: any) => data);
                    // this.preview = await this.blobToBase64(files[0]).then( data => data);
                }

                // para cada elemento del formulario
                this[form].controls[controlName].setValue(files[0]);
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

    /**
     * Recupera los datos de empresa
     */
    getDatosEmpresa(): any {
        this.configComercioSvc
            .getDatosEmpresa()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((resp: any) => {

                this.fDatosEmpresa.setValue({
                    razonSocial: resp.datosEmpresa.razonSocial,
                    direccion: resp.datosEmpresa.direccion,
                    tipoEntidad: resp.datosEmpresa.comercioTipoEmpresaId,
                    estado: resp.datosEmpresa.estado,
                    ruc: resp.files.ruc.value,
                    cct: resp.files.cct.value,
                });

                this.docRucList[0].estado = resp.files.ruc.estado;
                this.docRucList[0].value = resp.files.ruc.value;

                this.docRucList[1].estado = resp.files.cct.estado;
                this.docRucList[1].value = resp.files.cct.value;

            });
    }

    /**
     * Guarda los datos de la empresa (paso 1)
     */
    guardarDatosEmpresa(): void {

        this.getSeccionesVerificadas();

        if (this.fDatosEmpresa.untouched) {
            return;
        }

        if (this.fDatosEmpresa.invalid) {
            this.fDatosEmpresa.markAllAsTouched();
            this.snackbarService.showMessage('Formulario incompleto');
            return;
        }

        const fData = this.fDatosEmpresa.value;

        const formData = new FormData();
        formData.append('razonSocial', fData.razonSocial);
        formData.append('direccion', fData.direccion);
        formData.append('comercioTipoEmpresaId', fData.tipoEntidad);
        formData.append('ruc', fData.ruc);
        formData.append('cct', fData.cct);

        this.configComercioSvc
            .guardarDatosEmpresa(formData)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(() => {
                this.getDatosEmpresa();
                // recupera las secciones disponibles una vez que se guardan los datos
                // especificamente el tipo de usuario SA/SRL/UNIPESONAL, para recuperar
                // la sección correspondiente a documentos.
                this.getSeccionesDisponibles();
            });
    }

    /**
     * Recupera datos del banco
     */
    getDatosBanco(): any {
        this.configComercioSvc
            .getDatosBanco()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((resp: { datosBanco: { banco: string; nroCuenta: string; razonSocial: string; ruc: string; estado: string; estadoColor: string } }) => {

                if (this.seccionesVerificadas[2][this.pasosKeys.paso3]) {
                    this.fBanco.disable();
                }

                // this.seccionesVerificadas[2].color = resp.datosBanco.estadoColor;


                const { banco = '', nroCuenta = '', razonSocial = '', ruc = '', estado = '' } = resp.datosBanco;

                this.fBanco.setValue({banco, nroCuenta, razonSocial, ruc, estado});
            });
    }

    /**
     * Guarda los datos bancarios
     */
    guardarDatosBanco(): any {

        this.getSeccionesVerificadas();

        if (this.fBanco.untouched) {
            return;
        }

        this.configComercioSvc
            .guardarDatosBanco(this.fBanco.value)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(() => {});
    }

    /**
     * Recupera los documentos de empresa
     */
    getDocumentosEmpresa(): any {
        this.configComercioSvc
            .getDocumentosEmpresa()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((resp: Array<any>) => {

                if (resp.length === 0) {
                    return;
                }


                if (this.seccionesVerificadas[3][this.pasosKeys.paso4]) {
                    this.cargarDocumentos = false;
                }

                let i = 1;
                this.mostrarTextoPlantilla = false;
                this.documentoList = resp.map((e: any) => {
                    e['nro'] = i++;
                    e['cName'] = e.nombre.replaceAll(/\s/g,'');
                    if (e.template) {
                        this.mostrarTextoPlantilla = true;
                    }
                    return e;
                });

                this.documentoList.forEach( (e: any) => {
                    const fc = new FormControl(e.value, Validators.required);
                    this.fDocumentos.addControl(e.cName, fc);
                });

            });
    }

    /**
     * Guarda documentos de la empresa
     */
    guardarDocumentosEmpresa(): any {
        if (!this.cargarDocumentos) {
            return;
        }

        const fData = this.fDocumentos.value;
        const data = new FormData();
        let valString = '';

        this.documentoList.forEach( (e: any) => {
            valString += e.id + ',';
        });

        valString = '[' + valString.slice(0, -1) + ']';

        data.append('documentos', valString);
        this.documentoList.forEach( (d: any) => {
            data.append(d.id, fData[d.cName]);
        });
    
        this.configComercioSvc
            .guardarDocumentosEmpresa(data)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(() => {
                this.getDocumentosEmpresa();
            });
    }

    /**
     * Permite descargar el archivo
     *
     * @param url url del archivo
     */
    verArchivo(url: string): void {
        window.open(url, '_blank');
    }

    /**
     * Envía los datos para verificación en el server
     */
    verificarDatos(): void {
        this._fuseConfirmation
            .open({
                icon: {
                    name: 'warning',
                },
                title: 'Verificación de datos',
                message:
                    '¿Confirma que desea enviar los datos para que sean verificados por un operador?',
                actions: {
                    confirm: {
                        label: 'Enviar',
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
                  this.configComercioSvc
                      .enviarDatosParaVerificar()
                      .pipe(takeUntil(this.unsubscribe$))
                      .subscribe(() => {
                        // se actualiza el estado de las secciones
                        this.getSeccionesVerificadas();
                      });
                }
            });

    }
}
