import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/material/material.module';
import { RegistroComponent } from './registro.component';




@NgModule({
  declarations: [RegistroComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    // RegistroService,
  ]
})
export class RegistroModule { }
