import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { FuseMockApiModule } from '@fuse/lib/mock-api';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { mockApiServices } from 'app/mock-api';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { RegistroModule } from './pages/registro/registro.module';
import { AlertConfig, AlertModule } from '@full-fledged/alerts';
import { MaterialModule } from './material/material.module';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localePy from '@angular/common/locales/es-PY';
import { environment } from 'environments/environment';
import { SnackbarService } from './services/snackbar-service.service';
import { SharedComercioModule } from './shared-comercio/shared.module';

registerLocaleData(localePy, 'es-PY');

const routerConfig: ExtraOptions = {
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
};

const alertConfig: AlertConfig = {
    maxMessages: 5,
    timeout: 5000,
    positionX: 'right',
    positionY: 'bottom',
};

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),

        // Fuse, FuseConfig & FuseMockAPI
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),

        // Core module of your application
        CoreModule,

        // Layout module of your application
        LayoutModule,

        // 3rd party modules that require global configuration via forRoot
        MarkdownModule.forRoot({}),

        MaterialModule,

        // registro de comercio
        RegistroModule,

        AlertModule.forRoot(alertConfig),

        SharedComercioModule,
    ],
    bootstrap: [AppComponent],
    providers: [
        {
            provide: LOCALE_ID,
            useValue: 'es-PY',
        },
        { provide: MAT_DATE_LOCALE, useValue: 'es-PY' },
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
        {provide: 'BASE_API_URL', useValue: environment.apiUrl},
        {provide: 'BASE_APP_ID', useValue: environment.appId},
        SnackbarService,
    ],
})
export class AppModule {}
