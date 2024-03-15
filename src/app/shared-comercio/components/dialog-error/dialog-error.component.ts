import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

/**
 * Muestra un cuadro de diálogo con un mensaje de error, dando la opción de aceptar y ejecutar una acción posterior,
 * también es posible contar con un segundo botón cerrar o cancelar que cerrará el diálogo sin ejecutar la acción
 * posterior..
 *
 * @author Marcos Ortega <maortega@fctunca.edu.py>
 */
@Component({
  selector: 'app-dialog-error',
  templateUrl: './dialog-error.component.html',
  styleUrls: ['./dialog-error.component.scss']
})
export class DialogErrorComponent implements OnInit {
  /**
   * Texto a mostrar en el botón primmario (recomendado para las acciones)
   */
  textoBtnAceptar = 'Aceptar';
  /**
   * Texto a mostrar en el botón secundario (recomendado para cancelar acciones)
   */
  textoBtnCerrar = 'Cerrar';
  /**
   * True para mostrar dos botones.
   */
  aceptarCancelar = false;

  constructor(
    public dialogErrorRef: MatDialogRef<DialogErrorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    if (this.data.aceptarCancelar) {
      if (this.data.textoBtnAceptar !== this.textoBtnAceptar) {
        this.textoBtnAceptar = this.data.textoBtnAceptar;
      }
      if (this.data.textoBtnCerrar !== this.textoBtnCerrar) {
        this.textoBtnCerrar = this.data.textoBtnCerrar;
      }
      if (this.data.aceptarCancelar) {
        this.aceptarCancelar = this.data.aceptarCancelar;
      }
    }

  }

  /**
   * Cierra el diálogo y envía el texto aceptar.
   */
  public aceptar(): void {
    this.dialogErrorRef.close('aceptar');
  }

  /**
   * Cierra el diálogo y envía el texto cerrar.
   */
  public cerrar(): void {
    this.dialogErrorRef.close('cerrar');
  }

}
