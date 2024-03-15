export class ListaCompra {
  monto: number | any;
  codigo: string;
  descripcion: string;
  cantidad: number;

  constructor(monto?: number, codigo?: string, descripcion?: string, cantidad?: number) {
    this.monto = monto ?? 0;
    this.codigo = codigo ?? '';
    this.descripcion = descripcion?? '';
    this.cantidad = cantidad?? 0;
  }
}
