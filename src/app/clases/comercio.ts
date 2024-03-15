export class Comercio {
  id: number;
  // factorId: string;
  nombreFantasia: string;
  ruc: string;
  web: string;
  telefono: string;
  email: string;
  facebook: string;
  instagram: string;
  twitter: string;
  comercioTipo: string;
  fechaHora: string;

  constructor(id?: number, web?: string, nombreFantasia?: string, ruc?: string, facebook?: string, instagram?: string, twitter?: string, telefono?: string, email?: string, comercioTipo?: string, fechaHora?: string) {
    this.id = id ?? 0;
    this.web = web ?? '';
    this.nombreFantasia = nombreFantasia ?? '';
    this.ruc = ruc ?? '';
    this.facebook = facebook ?? '';
    this.instagram = instagram ?? '';
    this.twitter = twitter ?? '';
    this.telefono = telefono ?? '';
    this.email = email ?? '';
    this.comercioTipo = comercioTipo ?? '';
    this.fechaHora = fechaHora ?? '';
  }
}
