import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackbarService } from 'app/services/snackbar-service.service';
import { Subject, takeUntil } from 'rxjs';
import { ListaCompraComponent } from '../solicitud-credito/lista-compra/lista-compra.component';
import { DashboardService } from './dashboard.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    resumenList = [
        {
            titulo: 'Departamentos Vendidos ',
            icono: 'help_outline',
            valor: 810,
            tooltip: 'Monto total de fraccionamientos realizados a la fecha',
        },
        {
            titulo: 'Edificios Entregados',
            icono: 'help_outline',
            valor: 4,
            tooltip: 'Cantidad de fraccionamientos realizados a la fecha',
        },
        {
            titulo: 'Edificios en Construcción',
            icono: 'help_outline',
            valor: 6,
            tooltip: 'Valor promedio de cada pedido realizado',
        },
        {
            titulo: 'Unidades Entregadas',
            icono: 'help_outline',
            valor: 300,
            tooltip:
                'Porcentaje de clientes que realizaron un pago con Fraccionate luego de haber sido aprobados.',
        },
    ];

    verPanelConfiguracion = true;

    unsubscribe$: Subject<any> = new Subject();

    // para FUSE
    selectedProject = 'Fraccionate - Nissei';

    formFilter!: FormGroup;

    constructor(
        private dashboardService: DashboardService,
        private snackbarSvc: SnackbarService,
        private dialogCtrl: MatDialog,
        private router: Router,
        private fb: FormBuilder,
        public chartService: DashboardService
    ) {
        this.chartService.actualizarDatosFecha
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe();
        this.buildForm();
    }

    ngOnInit(): void {
        this.getValoresCabecera();
    }

    getValoresCabecera(): any {
        this.dashboardService
            .getTotalResumen({})
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((resp: any) => {
                this.snackbarSvc.noMessage();
                if (resp.data.length > 0) {
                    this.resumenList[0].valor =
                        resp.data[0].volumen_fraccionamiento;
                    this.resumenList[1].valor = resp.data[0].nrofraccionamiento;
                    this.resumenList[2].valor = resp.data[0].promedio;
                    this.resumenList[3].valor = resp.data[0].tasa_aprobacion;
                }
            });
    }

    configurarComercioPage(): any {
        this.router.navigate(['/comercio/configuracion-comercio']);
    }

    buildForm(): void {
        const date = new Date();

        this.formFilter = this.fb.group({
            mes: date.getMonth() + 1,
            anho: this.chartService.anhos[this.chartService.anhos.length - 1],
        });

        const fechaInicial = this.formFilter.getRawValue();

        this.formFilter.valueChanges.subscribe((data: any) => {
            this.chartService.fechaDesde = `${data.anho}-${data.mes}-01`;
            this.chartService.fechaHasta = `${data.anho}-${data.mes}-${new Date(
                data.anho,
                data.mes,
                0
            ).getDate()}`;
            this.chartService.actualizarDatosFecha.next(true);
            console.log(
                this.chartService.fechaDesde,
                this.chartService.fechaHasta
            );
        });

        this.chartService.fechaDesde = `${fechaInicial.anho}-${fechaInicial.mes}-01`;
        this.chartService.fechaHasta = `${fechaInicial.anho}-${
            fechaInicial.mes
        }-${new Date(fechaInicial.anho, fechaInicial.mes, 0).getDate()}`;

        // this.getData();
    }

}
