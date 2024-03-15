import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class GetParamsApiService {
    constructor(private http: HttpClient, @Inject('BASE_API_URL') public baseUrl: string,
    @Inject('BASE_APP_ID') public appId: string) { }
    getApiUrl(): Observable<string> {
        return this.http.get<any>('/api_url').pipe(
            map(res => this.baseUrl = res.api_url)
        );
    }

    getAppId(): Observable<string> {
        return this.http.get<any>('/app_id').pipe(
            map(res => this.appId = res.app_id)
        );
    }

    getApiConfig(): Observable<any> {
        return this.http.get<any>('/config');
    }
}
