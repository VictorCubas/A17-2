/**
 * Representa formato de una compra
 */
export interface CompraUsuario {
  id?: number;
  cliente: string;
  comercio: string;
  codigoCliente: string;
  fechaHora: string;
  estadoSolicitud: string;
  importe: number;
  carrito: Array<any>;
  mensajeCliente: string;
}
