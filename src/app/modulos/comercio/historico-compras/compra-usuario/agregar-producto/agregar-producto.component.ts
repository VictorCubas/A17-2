import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-agregar-producto',
  templateUrl: './agregar-producto.component.html',
  styleUrls: []
})
export class AgregarProductoComponent implements OnInit {

  form!: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AgregarProductoComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any = null,
  ) {
    this.buildForm(data);
  }

  buildForm(data: any = null): void {
    this.form = this.fb.group({
      codigo: [data ? data.codigo : '', Validators.required],
      descripcion: [ data ? data.descripcion : '', Validators.required],
      cantidad: [ data ? data.cantidad : '', Validators.required],
      monto: [ data ? data.monto : '', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  add(): void {
    this.cerrar(this.form.getRawValue());
  }

  cerrar(item = null): void {
    this.dialogRef.close(item);
  }

}
