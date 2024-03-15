import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {PageHeaderData} from './page-header-data';
import {PageHeaderDataService} from '../../services/page-header-data.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-form-header',
    templateUrl: './form-header.component.html',
    styleUrls: ['./form-header.component.scss']
})
export class FormHeaderComponent implements OnInit, OnDestroy {
    headerData!: PageHeaderData;
    unsubscribe$: Subject<any> = new Subject();
    constructor(private router: Router, private headerDataService: PageHeaderDataService) {
    }

    ngOnInit(): void {
        this.headerDataService.data$.pipe(takeUntil(this.unsubscribe$)).subscribe((res: any) => {
            this.headerData = res;
        });
    }

    ngOnDestroy(): any {
        this.unsubscribe$.next('');
        this.unsubscribe$.complete();
    }

    go(): void {
        this.router.navigate([this.headerData.linkT]);
    }
}
