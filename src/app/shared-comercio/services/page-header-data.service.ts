/* eslint-disable @typescript-eslint/member-ordering */
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {PageHeaderData} from '../components/forms-header/page-header-data';

@Injectable({
    providedIn: 'root'
})
export class PageHeaderDataService {
    private data: BehaviorSubject<PageHeaderData> = new BehaviorSubject(new PageHeaderData());
    data$ = this.data.asObservable();

    setHeaderData(data: PageHeaderData): void {
        this.data.next(data);
    }
}
