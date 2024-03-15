import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompraUsuarioComponent } from './compra-usuario/compra-usuario.component';
import { HistoricoCompraListComponent } from './historico-compras-list/historico-compras-list.component';

const routes: Routes = [
    {
        path: '',
        component: HistoricoCompraListComponent,
        pathMatch: 'full',
    },
    {
        path: 'nueva-venta',
        component: CompraUsuarioComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HistoricoComprasRoutingModule {}
