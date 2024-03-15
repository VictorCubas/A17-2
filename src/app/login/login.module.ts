import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { MaterialModule } from '../material/material.module';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';
import { RouterModule } from '@angular/router';
import { LoaderModule } from '../shared-comercio/components/loader/loader.module';



@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    // MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    // PasswordResetModule,
    LoginRoutingModule,
    RouterModule,
    LoaderModule,
  ],
  exports: [
    LoginComponent
  ]
})
export class LoginModule { }
