/* eslint-disable @typescript-eslint/naming-convention */
import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-datos-compra',
  templateUrl: './datos-compra.component.html',
  styleUrls: []
})
export class DatosCompraComponent implements OnInit {
  form!: FormGroup;
  private dataSource: any;

  constructor(
    private fb: FormBuilder,
    // @ts-ignore
    @Inject(MAT_DIALOG_DATA) public data,
    private ref: MatDialogRef<DatosCompraComponent>
  ) {
    this.dataSource = this.data.datosCompra;
  }

  ngOnInit(): void {
    console.log(this.dataSource);
  }

  construirFormGroup(): any {
    return  this.fb.group({
      nombre: [this.dataSource['nombre'] ?? '' , Validators.required],
      apellido: [this.dataSource['apellido'] ?? '', Validators.required],
      celular_nro: [this.dataSource['celular_nro'] ?? '', Validators.required],
      documento_nro: [this.dataSource['documento_nro'], Validators.required],
      email: [this.dataSource['email'], Validators.required],
    });
  }

  close(): void {
    this.ref.close();
  }

}
