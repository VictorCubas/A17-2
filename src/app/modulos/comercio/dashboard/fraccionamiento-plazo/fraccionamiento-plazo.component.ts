import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SnackbarService } from 'app/services/snackbar-service.service';
import { ApexOptions } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';
import { DashboardService } from '../dashboard.service';

@Component({
    selector: 'app-fraccionamiento-plazo',
    templateUrl: './fraccionamiento-plazo.component.html',
    styleUrls: ['./fraccionamiento-plazo.component.scss'],
})
export class FraccionamientoPlazoComponent implements OnInit, OnDestroy {
    colorScheme: any = {
        domain: [
            '#723E98',
            '#F9AC3D',
            '#985914',
            '#758C33',
            '#F78000',
            '#BDCC2A',
            '#FFDA00',
            '#EF4638',
        ],
    };

    unsubscribe$ = new Subject<void>();

    form!: FormGroup;

    // apex chart

    chart: ApexOptions = {
        series: [
            // {
            //     name: 'Marine Sprite',
            //     data: [44, 55, 41, 37, 22, 43, 21],
            // },
            // {
            //     name: 'Striking Calf',
            //     data: [53, 32, 33, 52, 13, 43, 32],
            // },
            // {
            //     name: 'Tank Picture',
            //     data: [12, 17, 11, 9, 15, 11, 20],
            // },
            // {
            //     name: 'Bucket Slope',
            //     data: [9, 7, 5, 8, 6, 9, 4],
            // },
            // {
            //     name: 'Reborn Kid',
            //     data: [25, 12, 19, 32, 25, 24, 10],
            // },
        ],
        chart: {
            type: 'bar',
            height: 350,
            stacked: true,
        },
        plotOptions: {
            bar: {
                horizontal: true,
            },
        },
        stroke: {
            width: 1,
            colors: ['#fff'],
        },
        xaxis: {
        },
        yaxis: {
            title: {
                text: 'Plazos (meses)',
            },
        },
        tooltip: {
            y: {
                formatter: (val: any) => val + ' fraccionamientos',
            },
            x: {
                formatter: (val: any) => val + ' meses',
            },
        },
        fill: {
            opacity: 1,
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
            offsetX: 40,
        },
    };

    show = false;

    constructor(
        public chartService: DashboardService,
        private fb: FormBuilder,
        private snackbarSvc: SnackbarService,
    ) {
        this.buildForm();
        this.chartService.actualizarDatosFecha.pipe(takeUntil(this.unsubscribe$)).subscribe( (val: boolean) => {
            if (val) {
                this.getData();
            }
        });
    }

    ngOnInit(): void {
        this.getData();
    }

    buildForm(): void {
        const date = new Date();

        this.form = this.fb.group({
            mes: date.getMonth() + 1,
            anho: this.chartService.anhos[this.chartService.anhos.length - 1],
        });

        this.form.valueChanges.subscribe(() => {
            this.getData();
        });

        this.getData();
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    getData(): void {
        const data = this.form.getRawValue();
        this.chartService
            .getCantidadFraccionamientosPorPlazo({
                mes: data.mes,
                anho: data.anho,
            })
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((resp: any) => {
                this.snackbarSvc.noMessage();
                this.chart.series = resp.series;
                this.chart.xaxis = {
                    categories: resp.categories,
                    title: {
                        text: 'Cantidad de fraccionamientos',
                    },
                };

                this.show = true;
            });
    }
}
