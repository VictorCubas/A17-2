export class Apikeys {
  id:          number;
  api_key_production:  string;
  api_key_test:  string;
  url_production:  string;
  url_test:  string;
  public_key_production:  string;
  public_key_test:  string;
  codigo:  string;
  comercio_id: number;

  constructor(id?: number, api_key_production?: string, api_key_test?: string,
              url_production?: string,url_test?: string,public_key_production?: string,
              public_key_test?: string,codigo?: string, comercio_id?: number) {
    this.id = id ?? 0;
    this.api_key_production =  api_key_production ?? '';
    this.api_key_test =  api_key_test ?? '';
    this.url_production =  url_production ?? '';
    this.url_test =  url_test ?? '';
    this.public_key_production =  public_key_production ?? '';
    this.public_key_test =  public_key_test ?? '';
    this.codigo =  codigo ?? '';
    this.comercio_id = comercio_id ?? 0;
  }
}
