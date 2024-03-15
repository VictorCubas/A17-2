import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MaterialModule} from "../../material/material.module";
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RegistroUsuarioComponent} from "./registro-usuario.component";



@NgModule({
  declarations: [RegistroUsuarioComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class RegistroUsuarioModule { }
