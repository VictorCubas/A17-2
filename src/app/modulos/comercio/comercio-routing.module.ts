import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ApidocsComponent} from './apidocs/apidocs.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
    },
    {
        path: 'apidocs',
        component: ApidocsComponent,
    },
    {
        path: 'usuario',
        loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule)
    },
    {
        path: 'apikeys',
        loadChildren: () => import('./apikeys/apikeys.module').then(m => m.ApikeysModule)
    },
    {
        path: 'fraccionamiento',
        loadChildren: () => import('./solicitud-credito/solicitud-credito.module').then(m => m.SolicitudCreditoModule)
    },
    {
        path: 'ventas',
        loadChildren: () => import('./historico-compras/historico-compras.module').then(m => m.HistoricoComprasModule)
    },
    {
        path: 'clientes',
        loadChildren: () => import('./clientes/clientes.module').then(m => m.ClientesModule)
    },
    {
        path: 'documentos',
        loadChildren: () => import('./documento-comercio/documento-comercio.module').then(m => m.DocumentoComercioModule)
    },
    {
        path: 'configuracion-comercio',
        loadChildren: () => import('./configuracion-comercio/configuracion-comercio.module').then(m => m.ConfiguracionComercioModule)
    },
    {
        path: 'comercio-sucursal',
        loadChildren: () => import('./sucursal/sucursal.module').then(m => m.SucursalModule)
    },
    {
        path: 'mis-comercios',
        loadChildren: () => import('./administrar-comercio/administrar-comercio.module').then(m => m.AdministrarComercioModule)
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ComercioRoutingModule {
}
