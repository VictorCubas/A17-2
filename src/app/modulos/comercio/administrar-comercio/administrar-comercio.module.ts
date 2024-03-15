import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComercioListComponent } from './comercio-list/comercio-list.component';
import { ComercioFormComponent } from './comercio-form/comercio-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/material/material.module';
import { SharedComercioModule } from 'app/shared-comercio/shared.module';
import { SharedModule } from 'app/shared/shared.module';
import { AdministrarComercioRoutingModule } from './administrar-comercio-routing.module';

@NgModule({
    declarations: [ComercioListComponent, ComercioFormComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        RouterModule,
        SharedModule,
        SharedComercioModule,
        AdministrarComercioRoutingModule,
    ],
})
export class AdministrarComercioModule {}
