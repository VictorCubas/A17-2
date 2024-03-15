import {HttpClient} from '@angular/common/http';
import {Inject} from '@angular/core';
import {Injectable} from '@angular/core';
import {observable, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class GetParamsApiService {

    constructor(private http: HttpClient,
                @Inject('BASE_API_URL') private baseUrl: string,
                @Inject('BASE_APP_ID') private appId: string,) {
    }

    getApiUrl(): Observable<string> {

        if (this.baseUrl === undefined || this.baseUrl === '') {
            return this.http.get<any>('/api_url').pipe(
                map(res => this.baseUrl = res.api_url)
            );
        } else {
            // TODO: borrar esto dps
            return new Observable(observable => observable.next(this.baseUrl));
        }
    }

    getApiConfig(): Observable<any> {
        return this.http.get<any>('/config')
    }
}
