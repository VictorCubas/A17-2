import { Inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { GetParamsApiService } from './get-params-api.service';

@Injectable()
export class AddServerUrlInterceptor implements HttpInterceptor {

  constructor(@Inject('BASE_API_URL') private baseUrl: string,
    @Inject('BASE_APP_ID') public appId: string,
    private getParamsApiService: GetParamsApiService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (((this.baseUrl === undefined || this.baseUrl === '') && request.url.includes('/config'))
      || request.url.match(/^http(s)?:\/\/(.*)$/)) {
      return next.handle(request);
    }

    if (this.baseUrl === undefined || this.baseUrl === '') {
      return this.getParamsApiService.getApiConfig().pipe(
        map((res: any) => {
          this.baseUrl = res.api_url;
          this.appId = res.app_id;
        }),
        switchMap(() => next.handle(this.actualizarBaseUrl(request)))
      );
    } else {
      return next.handle(this.actualizarBaseUrl(request));
    }
  }

  actualizarBaseUrl(request: any): HttpRequest<any> {
    const completeUrl = `${this.baseUrl}/${request.url}`;
    return request.clone({ url: completeUrl });
  }
}
