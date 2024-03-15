import {Component, Inject, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApikeysService } from '../../apikeys.service';


@Component({
  selector: 'app-publickeys',
  templateUrl: './publickeys.component.html',
  styleUrls: ['./publickeys.component.scss']
})
export class PublickeysComponent implements OnInit {
 miTitulo: string = '';
 mostrarInput: boolean = false;
  form!: FormGroup;
  constructor(
    private fb: FormBuilder,
    public service: ApikeysService,
    private dialogo: MatDialogRef<PublickeysComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {titulo: string;clave: string},
  ) {
    this.form = this.construirFormGroup();

    //Definimos tipo de datos a registrar
    switch ( this.data.titulo ) {
      case 'Producción':
        this.miTitulo='Clave Pública Producción';
        this.mostrarInput = true;
        break;
      case 'Test':
        this.miTitulo='Clave Pública Test';
        this.mostrarInput = true;
        break;
      case 'NotificacionProdu':
        this.miTitulo='Registrar Url Notificación - Producción';
        this.mostrarInput = false;
        break;
      case 'NotificacionTest':
        this.miTitulo='Registrar Url Notificación - Test';
        this.mostrarInput = false;
        break;
      default:
        this.miTitulo='';
        break;
    }
  }

  ngOnInit(
  ): void {
  }

  onNoClick(): any {
    this.dialogo.close();
  }

  construirFormGroup(): any {
    return  this.fb.group({
      clave: [this.data.clave ?? '' , Validators.required],
    });
  }

}
