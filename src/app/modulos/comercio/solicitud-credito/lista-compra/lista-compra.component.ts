import {Component, Inject, OnInit} from '@angular/core';
import {SolicitudCreditoService} from '../solicitud-credito.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ListaCompra} from '../../../../clases/lista-compra';
import {Subject, takeUntil} from "rxjs";
import {UserService} from "../../../../core/user/user.service";
import {SessionService} from "../../../../services/session.service";

@Component({
  selector: 'app-lista-compra',
  templateUrl: './lista-compra.component.html',
  styleUrls: []
})
export class ListaCompraComponent implements OnInit {
  // columnas para la tabla
  displayedColumns = ['codigo', 'descripcion', 'cantidad', 'monto'];
    comercioActual = null;
    comercios = [];
    user: any;


    dataSource: Array<ListaCompra> = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private solicitudCreditoService: SolicitudCreditoService,
    private _userService: UserService,
    private sessionSvc: SessionService,
    // @ts-ignore
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogref: MatDialogRef<ListaCompraComponent>
  ) {
  }

  ngOnInit(): void {
    if(this.data !== undefined){
      setTimeout(() => {
        this.obtenerListaCompraSolicitud(this.data);
      });
    }

      this.comercios = this.sessionSvc.getComercios();

      const comercioStorage = localStorage.getItem('comercio');
      console.log(comercioStorage);
      if (comercioStorage) {
          const comercioStorageObj = JSON.parse(comercioStorage);
          const index = this.comercios.findIndex( e => e.id === comercioStorageObj.id);

          this.comercioActual = this.comercios[index];

      } else {
          this.comercioActual = this.comercios[0];
      }

      // Subscribe to the user service
      this._userService.user$
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((user: any) => {
              console.log(user);
              this.user = user;
              // this.user.avatar = user.avatar;
             /* console.log(this.sessionSvc.getNombreUsuario());
              this.user.name = this.sessionSvc.getNombreUsuario();
              this.user.email = this.sessionSvc.getDocumentoUsuario();
              this.user.avatar = 'assets/images/avatars/market-png-logo.png';*/
          });
  }

  /**
   * Funcion para obtener la lista de compra de una solicitud de credito
   */
  obtenerListaCompraSolicitud(idSolicitud: number): any {
    this.solicitudCreditoService.obtenerListaCompra(idSolicitud)
      .subscribe(
        (data: any) => {
          // @ts-ignore
          if (data != null && data['data'] !== undefined) {
            // @ts-ignore
            this.dataSource = data['data'] as any[];
          } else {
            this.dataSource = [];
          }
          //this.snackbar.noMessage();
        });
  }

  /** Gets the total cost of all transactions. */
  getTotalCost(): any {
    return this.dataSource.map(t => t.monto).reduce((acc, value) => acc + value, 0);
  }

  getCantidad(): any {
    let sum = 0;
    this.dataSource.forEach( (e: any) => {
      sum += e.cantidad;
    });
    return sum;
  }

  close(): void {
    this.dialogref.close();
  }

}
