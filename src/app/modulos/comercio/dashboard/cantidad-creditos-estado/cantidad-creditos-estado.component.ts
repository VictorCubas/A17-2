import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SnackbarService } from 'app/services/snackbar-service.service';
import { ApexOptions } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';
import { DashboardService } from '../dashboard.service';

@Component({
    selector: 'app-cantidad-creditos-estado',
    templateUrl: './cantidad-creditos-estado.component.html',
    styleUrls: ['./cantidad-creditos-estado.component.scss'],
})
export class CantidadCreditosEstadoComponent implements OnInit, OnDestroy {
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
        series: [],
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
        // title: {
        //     text: 'Fiction Books Sales',
        // },
        xaxis: {
            // categories: [2008, 2009, 2010, 2011, 2012, 2013, 2014],
            // labels: {
            //     formatter: (val: any) => val + 'K',
            // },
        },
        yaxis: {
            title: {
                text: 'Montos',
            },
        },
        tooltip: {
            y: {
                formatter: (val: any) => val + '',
            },
            x: {
                formatter: (val: any) => val + ' montos',
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
        private snackbar: SnackbarService,
        public chartService: DashboardService,
        private fb: FormBuilder
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
            .getSolicitudesCreditoPorEstado({
                mes: data.mes,
                anho: data.anho,
            })
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((resp: any) => {
                console.log(resp);
                this.snackbar.noMessage();
                // const series = resp.series.map( (d: any) => {
                //     d['labels'] = d.name;
                //     delete d.name;
                //     return d;
                // });

                // console.log(series);

                this.chart.series = resp.series;
                // this.chart.series = series;
                this.chart.xaxis = {
                    categories: resp.categories,
                    title: {
                        text: 'Cantidad de creditos',
                    },
                };

                this.show = true;
            });
    }
}
