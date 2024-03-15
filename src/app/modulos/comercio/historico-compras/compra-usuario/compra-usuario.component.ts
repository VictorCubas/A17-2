import {Component, OnDestroy, OnInit, Optional, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SessionService } from 'app/services/session.service';
import { SnackbarService } from 'app/services/snackbar-service.service';
import { DialogConfirmComponent } from 'app/shared-comercio/components/dialog-confirm/dialog-confirm.component';
import { PageHeaderData } from 'app/shared-comercio/components/forms-header/page-header-data';
import { PageHeaderDataService } from 'app/shared-comercio/services/page-header-data.service';
import { Subject, takeUntil } from 'rxjs';

import { AgregarProductoComponent } from './agregar-producto/agregar-producto.component';
import { CompraUsuarioService } from './compra.service';
import {ListaCompra} from '../../../../clases/lista-compra';
import {MatTable} from '@angular/material/table';

@Component({
  selector: 'app-compra-usuario',
  templateUrl: './compra-usuario.component.html',
  styleUrls: [],
})
export class CompraUsuarioComponent implements OnInit, OnDestroy {
    @ViewChild(MatTable) table: MatTable<ListaCompra>;
    form!: FormGroup;
    unsubscribe$: Subject<any> = new Subject();
    cuotas: Array<{ periodos: number; cuota: number }> = [];
    timerImporte: any;
    //carrito: Array<any> = [];
    displayedColumns = ['codigo', 'descripcion', 'cantidad', 'monto','subtotal','acciones'];

    carrito: Array<ListaCompra>=[];


    constructor(
        private fb: FormBuilder,
        @Optional() private dialogRef: MatDialogRef<CompraUsuarioComponent>,
        private snackbar: SnackbarService,
        private sessionSvc: SessionService,
        private matDialog: MatDialog,
        private compraUsuarioSvc: CompraUsuarioService,
        private headerDataService: PageHeaderDataService
    ) {
        this.buildForm();
        this.headerDataService.setHeaderData(
            new PageHeaderData(
                'Registrar Compra de Usuario',
                'comercio/ventas',
                true,
                true
            )
        );
    }

    buildForm(data: any = null): void {
        this.form = this.fb.group({
            documentoNro: [data ? data.documento_nro : '', Validators.required],
            nombre: [data ? data.nombre : '', Validators.required],
            apellido: [data ? data.apellido : '', Validators.required],
            email: [data ? data.email : '', Validators.required],
            celularNro: [data ? data.celular_nro : '', Validators.required],
            importe: [data ? data.importe : '', Validators.required],
            periodos: [data ? data.periodos : '', Validators.required],
            cuota: [data ? data.cuotaMensual : '', Validators.required],
        });

        this.form.controls['importe'].valueChanges
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((val) => {
                if (val) {
                    clearInterval(this.timerImporte);
                    this.timerImporte = setInterval(() => {
                        this.getCuotas(val);
                    }, 1000);
                }
            });

        this.form.controls['periodos'].valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((val: any) => {
            console.log(val);
            if (val) {
                this.form.controls['cuota'].setValue(val.cuota);
            }
        });
    }

    getCuotas(val: number): any {
        if (!val) {
            return;
        }
        clearInterval(this.timerImporte);
        this.compraUsuarioSvc
            .getCuotas(val)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((resp: any) => {
                this.cuotas = resp.data;
            });
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next(0);
        this.unsubscribe$.complete();
    }

    addProducto(p: any = null): any {
        this.matDialog
            .open(AgregarProductoComponent, {
                data: p,
                // minWidth: '40vh',
                // minHeight: '70vh'
            })
            .afterClosed()
            .subscribe((resp) => {
                if (resp && p) {
                    const indx = this.carrito.findIndex((e: any) => e.codigo === p.codigo);

                    if (indx > -1) {
                        p.codigo = resp.codigo;
                        p.descripcion = resp.descripcion;
                        p.cantidad = resp.cantidad;
                        p.monto = resp.monto;
                        this.snackbar.showMessage('Producto Actualizado');
                        this.table.renderRows();
                    }
                } else {
                    if (resp) {
                        this.carrito.push(resp);
                        this.table.renderRows();
                    }
                }
            });
    }

    removerProducto(p: any): any {
        const indx = this.carrito.findIndex((e: any) => e.codigo === p.codigo);

        if (indx > -1) {
            this.carrito.splice(indx, 1);
            this.snackbar.showMessage('Producto removido');
            this.table.renderRows();
        }
    }

    editarProducto(p: any): any {
        this.addProducto(p);
    }

    sendForm(): void {

        if (this.form.invalid) {
            this.snackbar.showMessage('Favor completar campos requeridos');
            return;
        }

        if (this.carrito.length < 1) {
            this.snackbar.showMessage('El usuario debe tener al menos 1 producto');
            return;
        }

        let sumaCarrito = 0;
        this.carrito.forEach((p: any) => {
            sumaCarrito += (p.monto * p.cantidad);
        });


        const data = this.form.getRawValue();

        if (data.importe !== sumaCarrito) {
            this.snackbar.showMessage('El importe ingresado no coincide con la lista de productos.');
            return;
        }

        data.carrito = this.carrito;
        data.periodos = data.periodos.periodos;

        const fn = (): any => {
            this.compraUsuarioSvc.cargarPersonaCompra(data).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
                this.carrito = [];
                this.form.reset();
                this.cuotas = [];
            });
        };

        this.dialogInfo('Registro de Compra', '¿Confirma que desea registrar el usuario y su compra?', fn);

    }


    dialogInfo(titulo: string, menssage: string, callBack?: any): void {
        const data = {
            titulo,
            menssage,
            aceptarCancelar: true,
            textoBtnAceptar: 'Aceptar',
            textoBtnCerrar: 'Cancelar',
        };
        const modalSuccess = this.matDialog.open(DialogConfirmComponent, {data});
        modalSuccess.afterClosed().subscribe((result) => {
            console.log(result);
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            callBack ? callBack(result) : null;
        });
    }

    getCantidad(): any {
        let sum = 0;
        this.carrito.forEach((e: any) => {
            sum += e.cantidad;
        });
        return sum;
    }

    getTotalCost(): any {
        return this.carrito.map(t => t.cantidad*t.monto).reduce((acc, value) => acc + value, 0);
    }
}
