import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfiguracionComercioComponent } from './configuracion-comercio.component';

const routes: Routes = [
    {
        path: '',
        component: ConfiguracionComercioComponent,
        pathMatch: 'full',
    },
    {
        path: ':seccion',
        component: ConfiguracionComercioComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ConfiguracionComercioRoutingModule {}
