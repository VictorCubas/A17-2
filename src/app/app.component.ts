import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetParamsApiService } from './services/get-params-api.service';
import { SessionService } from './services/session.service';
import { SettingsService } from './services/settings.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    /**
     * Constructor
     */
    constructor(
        private router: Router,
        private getParamsService: GetParamsApiService,
        private settings: SettingsService,
        private sessionSvc: SessionService
    ) {
        const dataStorage = localStorage.getItem('session');

        if (dataStorage) {

            const storageObj = JSON.parse(dataStorage);

            if (!storageObj.comercios || storageObj.comercios.length === 0) {
                this.sessionSvc.logout();
                return;
            }

            this.sessionSvc.setSession(JSON.parse(dataStorage));

            const esDesarrollador =
                dataStorage.includes('Api keys') &&
                !dataStorage.includes('Usuario');

            console.log('Api keys', dataStorage.includes('Api keys'));
            console.log('Usuario', dataStorage.includes('Usuario'));
            console.log(dataStorage.includes('Api keys') &&
            !dataStorage.includes('Usuario'));
            if (esDesarrollador) {
                this.router.navigate(['comercio/apikeys']);
            } else {
                this.router.navigate(['comercio']);
            }
        } else {
            this.router.navigate(['sign-in']);
        }
    }

    ngOnInit(): void {
        this.getParamsService.getApiConfig().subscribe((data) => {
            this.settings.URL_BASE = data.api_url;
            this.settings.APP_ID = data.app_id;
        });
    }
}
