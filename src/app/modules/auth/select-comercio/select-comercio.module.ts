import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectComercioComponent } from './select-comercio.component';
import { selectComerciodRoutes } from './select-comercio.routing';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    SelectComercioComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(selectComerciodRoutes),
  ]
})
export class SelectComercioModule { }
